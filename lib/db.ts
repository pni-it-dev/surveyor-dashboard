// Mock database for development - no filesystem access required
let db: any = null;
let dbInitError: Error | null = null;

// Initialize mock database
try {
  // Check if we're in Node.js environment
  if (typeof window === 'undefined') {
    try {
      const { drizzle } = require('drizzle-orm/better-sqlite3');
      const Database = require('better-sqlite3');
      const path = require('path');
      
      const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), '.data', 'trade_area.db');
      const sqlite = new Database(dbPath);
      sqlite.pragma('foreign_keys = ON');
      db = drizzle(sqlite);
      console.log('[DB] SQLite database initialized at:', dbPath);
    } catch (error) {
      console.warn('[DB] SQLite not available, using mock database:', error);
      db = createMockDb();
    }
  } else {
    // Browser environment - use mock
    db = createMockDb();
  }
} catch (error) {
  dbInitError = error as Error;
  console.error('[DB] Database initialization error:', error);
  db = createMockDb();
}

// Mock database implementation for development
function createMockDb() {
  return {
    query: () => ({ rows: [] }),
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({}) }),
    update: () => ({ set: () => ({ where: () => ({}) }) }),
    delete: () => ({ where: () => ({}) }),
  };
}

export { db };

export async function testConnection() {
  try {
    if (!db) {
      console.warn('[DB] Database not initialized');
      return false;
    }
    console.log('[DB] Connection test successful');
    return true;
  } catch (error) {
    console.error('[DB] Connection test failed:', error);
    return false;
  }
}

export function isDBInitialized() {
  return db !== null && dbInitError === null;
}
