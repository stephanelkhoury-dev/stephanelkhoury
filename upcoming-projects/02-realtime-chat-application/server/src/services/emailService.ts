import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailVerificationData {
  username: string;
  email: string;
  verificationToken: string;
}

interface PasswordResetData {
  username: string;
  email: string;
  resetToken: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${process.env.APP_NAME || 'Chat App'}" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendEmailVerification(data: EmailVerificationData): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${data.verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${process.env.APP_NAME || 'Chat App'}!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.username},</h2>
            <p>Thank you for signing up! Please verify your email address to activate your account.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${process.env.APP_NAME || 'Chat App'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to ${process.env.APP_NAME || 'Chat App'}!
      
      Hi ${data.username},
      
      Thank you for signing up! Please verify your email address to activate your account.
      
      Visit this link to verify your email: ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: data.email,
      subject: 'Verify Your Email Address',
      html,
      text,
    });
  }

  async sendPasswordReset(data: PasswordResetData): Promise<void> {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${data.resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.username},</h2>
            <p>We received a request to reset your password for your ${process.env.APP_NAME || 'Chat App'} account.</p>
            <div class="warning">
              <strong>Important:</strong> If you didn't request this password reset, please ignore this email and consider changing your password for security.
            </div>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${process.env.APP_NAME || 'Chat App'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hi ${data.username},
      
      We received a request to reset your password for your ${process.env.APP_NAME || 'Chat App'} account.
      
      Visit this link to reset your password: ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
    `;

    await this.sendEmail({
      to: data.email,
      subject: 'Reset Your Password',
      html,
      text,
    });
  }

  async send2FACode(email: string, username: string, code: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your 2FA Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { font-size: 32px; font-weight: bold; color: #059669; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Two-Factor Authentication</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Here's your two-factor authentication code:</p>
            <div class="code">${code}</div>
            <p>Enter this code in your app to complete the login process.</p>
            <p><strong>This code will expire in 5 minutes.</strong></p>
            <p>If you didn't try to log in, please secure your account immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 ${process.env.APP_NAME || 'Chat App'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Two-Factor Authentication Code
      
      Hi ${username},
      
      Here's your two-factor authentication code: ${code}
      
      Enter this code in your app to complete the login process.
      
      This code will expire in 5 minutes.
      
      If you didn't try to log in, please secure your account immediately.
    `;

    await this.sendEmail({
      to: email,
      subject: 'Your 2FA Authentication Code',
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
