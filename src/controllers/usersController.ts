import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.user_id);
        user ? res.status(200).json(user) : res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await UserModel.create({ username, email, password });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.user_id,
            req.body,
            { new: true, runValidators: true }
        );
        updatedUser
            ? res.status(200).json(updatedUser)
            : res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.user_id);
        deletedUser
            ? res.status(200).json(deletedUser)
            : res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Registration handler
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
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

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login handler
export const loginUser = async (req: Request, res: Response):Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout handler
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        const user = await UserModel.findOne({ refreshToken });
        if (!user) {
            res.status(400).json({ message: 'Invalid token' });
        }

        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
