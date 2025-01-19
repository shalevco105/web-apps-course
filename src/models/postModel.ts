import mongoose, { Schema } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  sender_id: string;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender_id: { type: String, required: true },
  },
  { collection: "Post" }
);

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
