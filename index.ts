import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoute from './src/routes/postRoute';

const app = express();

app.use(bodyParser.json());

app.use("/post", postRoute);

mongoose
  .connect('mongodb://localhost:27017/course')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log(err));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));