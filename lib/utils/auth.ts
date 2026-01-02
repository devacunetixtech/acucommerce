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



import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthUser } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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
    // FIXED: Cast to 'any' to strictly silence the overload mismatch error
    { expiresIn: JWT_EXPIRES_IN as any }
  );
};

export const verifyToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
};
