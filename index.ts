import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoute from './src/routes/postRoute';
import commentsRouter from "./src/routes/commentsRouter";
import usersRouter from "./src/routes/usersRouter";
import cors from 'cors';

import dotenv from 'dotenv';
import authRouter from './src/routes/authRouter';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

app.use("/post", postRoute);

app.use("/comments", commentsRouter);

app.use("/user", usersRouter);

app.use("/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log(err));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));