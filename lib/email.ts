import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    console.warn('[EMAIL] SMTP credentials not configured. Email sending will be disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log('[EMAIL] SMTP not configured, skipping email send');
    console.log(`[EMAIL] Would send to: ${options.to}`);
    console.log(`[EMAIL] Subject: ${options.subject}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@tradearea.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[EMAIL] Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName?: string
): Promise<boolean> {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f3a93;">Password Reset Request</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p>
        <a href="${resetLink}" style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        ">Reset Password</a>
      </p>
      <p>Or copy this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetLink}</p>
      <p style="color: #999; font-size: 12px;">
        This link will expire in 24 hours.
        <br/>
        If you didn't request this reset, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        Trade Area Analysis Report
        <br/>
        This is an automated email, please do not reply.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request - Trade Area Analysis Report',
    html,
  });
}

export async function sendWelcomeEmail(email: string, userName?: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f3a93;">Welcome to Trade Area Analysis Report</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Your account has been successfully created. You can now log in to access the dashboard.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        ">Go to Login</a>
      </p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        Trade Area Analysis Report
        <br/>
        This is an automated email, please do not reply.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Trade Area Analysis Report',
    html,
  });
}
