import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET = 'mysecret';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};

export const getUserFromToken = (req: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = verifyToken(token) as JwtPayload; // Verifies and decodes the JWT
    return decodedToken.userId;
  } catch (error) {
    return null;
  }
};
