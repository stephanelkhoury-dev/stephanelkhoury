import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthSDK {
  /**
   * Hash a password
   */
  static async hashPassword(password: string): Promise<string> {
    return hash(password, SALT_ROUNDS);
  }

  /**
   * Compare a password with a hash
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  /**
   * Generate a JWT token
   */
  static generateToken(payload: TokenPayload): string {
    return sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  /**
   * Verify a JWT token
   */
  static verifyToken(token: string): TokenPayload {
    try {
      return verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new Error('Invalid authorization header');
    }

    return token;
  }
}
