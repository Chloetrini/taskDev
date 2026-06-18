import jwt from "jsonwebtoken";
import crypto from "crypto";


// GENERATE JWT — used after login

export const generateJWT = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  } as jwt.SignOptions);
};


// GENERATE RANDOM TOKEN — for email verify & password reset
// Raw token goes in the email link
// Hashed token gets stored in the database

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};


// HASH TOKEN — before storing in database
// Never store raw tokens — always hash first

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};