import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    refreshToken: string | null; 
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: null,
    },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
