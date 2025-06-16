import { Request, Response, NextFunction } from 'express';
export interface AuthUser {
    userId: string;
    _id: string;
    username: string;
    email: string;
    status: string;
    avatar?: string;
    bio?: string;
    isEmailVerified: boolean;
    preferences: any;
    twoFactorAuth: any;
    devices: any[];
    contacts: string[];
    blockedUsers: string[];
    statusMessage?: string;
    lastSeen?: Date;
    createdAt?: Date;
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map