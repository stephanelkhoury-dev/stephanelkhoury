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
declare class EmailService {
    private transporter;
    constructor();
    sendEmail(options: EmailOptions): Promise<void>;
    sendEmailVerification(data: EmailVerificationData): Promise<void>;
    sendPasswordReset(data: PasswordResetData): Promise<void>;
    send2FACode(email: string, username: string, code: string): Promise<void>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map