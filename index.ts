import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoute from './src/routes/postRoute';
import commentsRouter from "./src/routes/commentsRouter";
import usersRouter from "./src/routes/usersRouter";
import { authenticateToken } from './src/middlewares/auth';

const app = express();

app.use(bodyParser.json());

app.use("/post", postRoute);

app.use("/comments", commentsRouter);

app.use("/user", usersRouter);

app.get('/user/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Protected data' });
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log(err));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));