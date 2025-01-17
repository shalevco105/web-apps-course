import { Application } from "express";
import mongoose from "mongoose";
import request from "supertest";
import appPromise from "../index";

let app: Application;
let token: string;

beforeAll(async () => {
    app = await appPromise;
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            user: {
                email: "vardiroy4@gmail.com",
                password: "abc123",
            },
        });
    console.log(response.body);  // Check token is present here
    token = response.body.accessToken;
});

afterAll((done) => {

    mongoose.connection.close();
    done();
});

describe("Authentication", () => {

    test("login success", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                user: {
                    email: "vardiroy4@gmail.com",
                    password: "abc123",
                },
            });
        expect(res.statusCode).toEqual(200);
    });

    test("login incorrect password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                user: {
                    email: "vardiroy4@gmail.com",
                    password: "wrongPassword",
                },
            });
        expect(res.statusCode).toEqual(400);
    });

    test("logout success", async () => {
        const res = await request(app)
            .post("/api/auth/logout")
            .set("authorization", token);
        expect(res.statusCode).toEqual(200);
    });
});
