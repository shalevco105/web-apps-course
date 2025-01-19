import mongoose, { Schema, Model } from 'mongoose';

export interface IComment {
    message: string;
    sender_id: string;
    post_id: string;
}

const commentSchema: Schema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender_id: {
        type: String,
        required: true,
    },
    post_id: {
        type: String,
        required: true,
    },
});

const commentModel: Model<IComment> = mongoose.model<IComment>('Comments', commentSchema);

export default commentModel;
