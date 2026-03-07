import { NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';

export function isAdminRequest(request: NextRequest) {
  const token = process.env.ADMIN_DASHBOARD_TOKEN;
  if (!token) {
    return false;
  }

  const auth = request.headers.get('authorization') || '';
  if (auth === `Bearer ${token}`) {
    return true;
  }

  const cookieToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return cookieToken === token;
}
