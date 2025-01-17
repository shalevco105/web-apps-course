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
                email: "romrom20022002@gmail.com",
                password: "abc123",
            },
        });
    token = response.body.accessToken;
});

afterAll((done) => {
    mongoose.connection.close();
    done();
});

describe("Recipe", () => {

    test("recipe of app users", async () => {
        const res = await request(app)
            .get("/api/recipes/users")
            .set("authorization", token);
        expect(res.statusCode).toEqual(200);
    });

    test("get recipe comments", async () => {
        const res = await request(app)
            .get("/api/recipes/users/65abdd4fea2d8c6b1a5f23c4")
            .set("authorization", token);
        expect(res.statusCode).toEqual(200);
    });

    test("get recipe image", async () => {
        const res = await request(app)
            .get("/api/recipes/img/65be3adaaaf8f5afba2db380")
            .set("authorization", token);
        expect(res.statusCode).toEqual(200);
    });
});