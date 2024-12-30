import jwt from 'jsonwebtoken';
import { Response } from "express";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): any => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const setTokenCookie = (res: Response, name: string, token: string): void => {
    res.cookie(name, token, {
        httpOnly: true,
        maxAge: 3600000,
    });
}