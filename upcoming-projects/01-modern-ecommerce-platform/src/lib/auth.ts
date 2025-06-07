import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export function requireAuth(request: NextRequest): AuthUser | Response {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Authentication required',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  const user = verifyToken(token);
  
  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid or expired token',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  return user;
}

export function requireAdmin(request: NextRequest): AuthUser | Response {
  const authResult = requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }
  
  if (authResult.role !== 'ADMIN') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Admin access required',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  return authResult;
}
