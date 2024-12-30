import express from 'express';
import mongoose from 'mongoose';
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
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

if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev Rom&Shalev",
                version: "1.0.0",
                description: "REST server Rom and Shalev",
            },
            servers: [{ url: "http://localhost:3000" }],
        },
        apis: ["src/api/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}


app.use("/post", postRoute);

app.use("/comments", commentsRouter);

app.use("/user", usersRouter);

app.use("/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log(err));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));