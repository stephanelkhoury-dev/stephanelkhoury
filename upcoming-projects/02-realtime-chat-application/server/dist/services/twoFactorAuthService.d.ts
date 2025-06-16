interface TwoFactorSetupResult {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
}
interface BackupCodeValidation {
    isValid: boolean;
    remainingCodes?: number;
}
declare class TwoFactorAuthService {
    /**
     * Generate 2FA secret and QR code for user setup
     */
    generateSecret(userId: string): Promise<TwoFactorSetupResult>;
    /**
     * Verify TOTP token and enable 2FA for user
     */
    enableTwoFactor(userId: string, secret: string, token: string, backupCodes: string[]): Promise<boolean>;
    /**
     * Disable 2FA for user
     */
    disableTwoFactor(userId: string, password: string): Promise<boolean>;
    /**
     * Verify TOTP token for login
     */
    verifyToken(secret: string, token: string): boolean;
    /**
     * Verify backup code
     */
    verifyBackupCode(userId: string, code: string): Promise<BackupCodeValidation>;
    /**
     * Generate new backup codes
     */
    generateNewBackupCodes(userId: string, password: string): Promise<string[]>;
    /**
     * Check if user has 2FA enabled
     */
    isTwoFactorEnabled(userId: string): Promise<boolean>;
    /**
     * Generate backup codes
     */
    private generateBackupCodes;
    /**
     * Hash backup codes for storage
     */
    private hashBackupCodes;
    /**
     * Hash single backup code
     */
    private hashBackupCode;
    /**
     * Generate temporary 2FA code for email/SMS backup
     */
    generateTemporaryCode(): string;
}
export declare const twoFactorAuthService: TwoFactorAuthService;
export {};
//# sourceMappingURL=twoFactorAuthService.d.ts.map