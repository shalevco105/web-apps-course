import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
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
        required: false,
    },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
