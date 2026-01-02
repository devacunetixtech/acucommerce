import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import { AuthUser } from '@/types';

export const authenticate = (request: NextRequest): AuthUser | null => {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
};

export const requireAuth = (request: NextRequest): AuthUser => {
  const user = authenticate(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
};

export const requireAdmin = (request: NextRequest): AuthUser => {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
};