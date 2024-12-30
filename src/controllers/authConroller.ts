import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { generateAccessToken, generateRefreshToken, setTokenCookie, verifyRefreshToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const accessToken = generateAccessToken(newUser._id.toString());
        const refreshToken = generateRefreshToken(newUser._id.toString());

        newUser.refreshToken = refreshToken;
        await newUser.save();

        setTokenCookie(res, 'refreshToken', refreshToken);
        setTokenCookie(res, 'accessToken', accessToken);
        res.status(201).json('You have successfully registered');
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        user.refreshToken = refreshToken;
        await user.save();

        setTokenCookie(res, 'refreshToken', refreshToken);
        setTokenCookie(res, 'accessToken', accessToken);
        res.status(201).json('You have successfully logined');
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body; 

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        return
    }

    try {
        const decoded = verifyRefreshToken(refreshToken); 
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        const newAccessToken = generateAccessToken(user._id.toString());
        setTokenCookie(res, 'accessToken', newAccessToken);
        res.status(201).json('You have successfully refreshed your access token');
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};