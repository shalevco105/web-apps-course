import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

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
        const user = await UserModel.findById(req.user?.userId);
        user ? res.status(200).json(user) : res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user?.userId,
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
        const deletedUser = await UserModel.findByIdAndDelete(req.user?.userId);
        console.log("deletedUser", deletedUser)
        deletedUser
            ? res.status(200).json(deletedUser)
            : res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
};