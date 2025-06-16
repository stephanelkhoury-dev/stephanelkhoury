import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User, IUser } from '../models/User';

interface TwoFactorSetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

interface BackupCodeValidation {
  isValid: boolean;
  remainingCodes?: number;
}

class TwoFactorAuthService {
  /**
   * Generate 2FA secret and QR code for user setup
   */
  async generateSecret(userId: string): Promise<TwoFactorSetupResult> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${process.env.APP_NAME || 'Chat App'} (${user.email})`,
      issuer: process.env.APP_NAME || 'Chat App',
      length: 32,
    });

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32!,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify TOTP token and enable 2FA for user
   */
  async enableTwoFactor(
    userId: string,
    secret: string,
    token: string,
    backupCodes: string[]
  ): Promise<boolean> {
    // Verify the token
    const isValid = this.verifyToken(secret, token);
    
    if (!isValid) {
      return false;
    }

    // Enable 2FA for user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.twoFactorAuth = {
      enabled: true,
      secret,
      backupCodes: this.hashBackupCodes(backupCodes),
    };

    await user.save();
    return true;
  }

  /**
   * Disable 2FA for user
   */
  async disableTwoFactor(userId: string, password: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password before disabling 2FA
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return false;
    }

    user.twoFactorAuth = {
      enabled: false,
      secret: undefined,
      backupCodes: [],
    };

    await user.save();
    return true;
  }

  /**
   * Verify TOTP token for login
   */
  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 steps before/after for time sync issues
    });
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(userId: string, code: string): Promise<BackupCodeValidation> {
    const user = await User.findById(userId);
    if (!user || !user.twoFactorAuth.enabled) {
      return { isValid: false };
    }

    const hashedCode = this.hashBackupCode(code);
    const codeIndex = user.twoFactorAuth.backupCodes.indexOf(hashedCode);

    if (codeIndex === -1) {
      return { isValid: false };
    }

    // Remove used backup code
    user.twoFactorAuth.backupCodes.splice(codeIndex, 1);
    await user.save();

    return {
      isValid: true,
      remainingCodes: user.twoFactorAuth.backupCodes.length,
    };
  }

  /**
   * Generate new backup codes
   */
  async generateNewBackupCodes(userId: string, password: string): Promise<string[]> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const backupCodes = this.generateBackupCodes();
    user.twoFactorAuth.backupCodes = this.hashBackupCodes(backupCodes);
    await user.save();

    return backupCodes;
  }

  /**
   * Check if user has 2FA enabled
   */
  async isTwoFactorEnabled(userId: string): Promise<boolean> {
    const user = await User.findById(userId);
    return user?.twoFactorAuth?.enabled || false;
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-digit backup codes
      const code = Math.random().toString().slice(2, 10);
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup codes for storage
   */
  private hashBackupCodes(codes: string[]): string[] {
    const crypto = require('crypto');
    return codes.map(code => 
      crypto.createHash('sha256').update(code).digest('hex')
    );
  }

  /**
   * Hash single backup code
   */
  private hashBackupCode(code: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Generate temporary 2FA code for email/SMS backup
   */
  generateTemporaryCode(): string {
    return Math.random().toString().slice(2, 8); // 6-digit code
  }
}

export const twoFactorAuthService = new TwoFactorAuthService();
