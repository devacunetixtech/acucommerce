// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { AuthUser } from '@/types';

// const JWT_SECRET = process.env.JWT_SECRET!;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// export const hashPassword = async (password: string): Promise<string> => {
//   return await bcrypt.hash(password, 12);
// };

// export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
//   return await bcrypt.compare(password, hashedPassword);
// };

// export const generateToken = (user: AuthUser): string => {
//   return jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     JWT_SECRET,
    // FIXED: Type assertion added here to satisfy the overload
//     { expiresIn: JWT_EXPIRES_IN as string }
//   );
// };

// export const verifyToken = (token: string): AuthUser | null => {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
//     return decoded;
//   } catch (error) {
//     return null;
//   }
// };


import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthUser } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing environment variable JWT_SECRET');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): AuthUser | null => {
  try {
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(raw, JWT_SECRET) as JwtPayload | string;
    if (typeof decoded === 'string') return null;
    return {
      id: (decoded as any).id,
      email: (decoded as any).email,
      role: (decoded as any).role,
    } as AuthUser;
  } catch (error) {
    return null;
  }
};