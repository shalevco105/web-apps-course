import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired access token' }); 
    }
};
