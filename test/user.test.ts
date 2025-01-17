import { Application } from "express";
import mongoose from "mongoose";
import request from "supertest";
import appPromise from "../index";

let app: Application;
let token: string;

beforeAll(async () => {
    app = await appPromise;

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            user: {
                email: "romrom20022002@gmail.com",
                password: "1234asdfgh",
            },
        });

    if (loginResponse.statusCode !== 200) {
        throw new Error(
            `Failed to log in: ${loginResponse.body.message || "Unknown error"}`
        );
    }

    token = loginResponse.body.accessToken;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Users API", () => {
    test("Retrieve all users", async () => {
        const res = await request(app)
            .get("/api/users/data")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty("email");
            expect(res.body[0]).toHaveProperty("username");
        }
    });

    test("Retrieve logged-in user info", async () => {
        const res = await request(app)
            .get("/api/users/myInfo")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("username");
        expect(res.body.email).toBe("romrom20022002@gmail.com");
    });

    test("Update logged-in user status", async () => {
        const newStatus = "This is a test status update";
        const res = await request(app)
            .put("/api/users/myInfo")
            .set("Authorization", `Bearer ${token}`)
            .send({ status: newStatus });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status", newStatus);
    });

    test("Retrieve another user's photo", async () => {
        const email = "romrom20022002@gmail.com";
        const res = await request(app)
            .get(`/api/users/myPhoto/${email}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("photo");
        expect(typeof res.body.photo).toBe("string");
    });

    test("Delete logged-in user", async () => {
        const res = await request(app)
            .delete("/api/users/myInfo")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("User deleted successfully");
    });
});
