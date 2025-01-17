import mongoose from "mongoose";
import request from "supertest";
import {UserModel} from "../src/models/userModel";
import {app} from "../index";
import {userMock1} from "../src/__mocks__/user.mock";

let token: string;
let userId: string;

beforeAll(async () => {
    await request(app).post("/auth/register").send(userMock1);
    const response = await request(app).post("/auth/login").send(userMock1);
    token = (response.headers['set-cookie'])[1].split(';')[0].split('=')[1];
    console.log("body", response.body._id)
    userId = response.body._id;
});

afterAll(async () => {
    await UserModel.deleteMany();
    await mongoose.connection.close();
});

describe("Users API", () => {
    test("Retrieve all users", async () => {
        const res = await request(app)
            .get("/user/data")
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
            .get(`/user/${userId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("username");
        expect(res.body.email).toBe(userMock1.email);
    });

    test("Update logged-in user email", async () => {
        const newEmail = "This is a test email update";
        const res = await request(app)
            .put(`/user/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ email: newEmail});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", newEmail);
    });

    test("Delete logged-in user", async () => {
        const res = await request(app)
            .delete(`/user/${userId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("username");
        expect(res.body.username).toBe(userMock1.username);
    });
});
