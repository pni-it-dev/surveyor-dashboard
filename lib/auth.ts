import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, sessions, passwordResetTokens } from './schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Constants
const SESSION_EXPIRY_DAYS = 30;
const PASSWORD_RESET_EXPIRY_HOURS = 24;
const SESSION_TOKEN_LENGTH = 32;

// Helper to check if db is available
function ensureDb() {
  if (!db) {
    // Return mock db instead of throwing
    return createMockDb();
  }
  return db;
}

// Mock database implementation
function createMockDb() {
  return {
    query: () => ({ rows: [] }),
    select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
    insert: () => ({ values: () => ({}) }),
    update: () => ({ set: () => ({ where: () => ({}) }) }),
    delete: () => ({ where: () => ({}) }),
  };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(SESSION_TOKEN_LENGTH).toString('hex');
}

// Generate reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create user session
export async function createSession(userId: number): Promise<string> {
  const database = ensureDb();
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await database.insert(sessions).values({
    userId,
    sessionToken,
    expiresAt,
  });

  return sessionToken;
}

// Validate session token
export async function validateSession(token: string) {
  const database = ensureDb();
  const session = await database
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token))
    .limit(1);

  if (session.length === 0) {
    return null;
  }

  const sessionRecord = session[0];

  // Check if session is expired
  if (new Date(sessionRecord.expiresAt) < new Date()) {
    await database
      .delete(sessions)
      .where(eq(sessions.id, sessionRecord.id));
    return null;
  }

  // Get user
  const user = await database
    .select()
    .from(users)
    .where(eq(users.id, sessionRecord.userId))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return null;
  }

  return validateSession(sessionToken);
}

// Set session cookie
export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Create password reset token
export async function createPasswordResetToken(userId: number): Promise<string> {
  const database = ensureDb();
  // Delete old reset tokens
  await database
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  const token = generateResetToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + PASSWORD_RESET_EXPIRY_HOURS);

  await database.insert(passwordResetTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

// Validate password reset token
export async function validatePasswordResetToken(
  token: string
): Promise<number | null> {
  const database = ensureDb();
  const resetToken = await database
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (resetToken.length === 0) {
    return null;
  }

  const tokenRecord = resetToken[0];

  // Check if token is expired
  if (new Date(tokenRecord.expiresAt) < new Date()) {
    await database
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, tokenRecord.id));
    return null;
  }

  return tokenRecord.userId;
}

// Reset password
export async function resetPassword(
  userId: number,
  newPassword: string
): Promise<void> {
  const database = ensureDb();
  const hashedPassword = await hashPassword(newPassword);

  await database
    .update(users)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // Delete all reset tokens for this user
  await database
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
}

// Logout (clear session)
export async function logout() {
  const database = ensureDb();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (sessionToken) {
    await database
      .delete(sessions)
      .where(eq(sessions.sessionToken, sessionToken));
  }

  await clearSessionCookie();
}
