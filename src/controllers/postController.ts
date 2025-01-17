import { Request, Response } from 'express';
import Post from '../models/postModel';

// Add a New Post
export const addPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.title || !req.body.content || !req.body.sender_id) {
      res.status(400).json({ error: 'Post data missing' });
      return ;
    }
    const { title, content, sender_id } = req.body;
    const newPost = new Post({ title, content, sender_id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get All Posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find();
    console.log({ posts });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a Post by ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return ;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get Posts by Sender
export const getPostsBySender = async (req: Request, res: Response): Promise<void> => {
  try {
    const senderId = req.query.sender as string;
    const posts = await Post.find({ sender_id: senderId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a Post
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.post_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
