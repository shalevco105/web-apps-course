import supertest from 'supertest';
import mongoose from 'mongoose';
import { UserModel } from "../src/models/userModel";
import { userMock1, userMock2 } from "../src/__mocks__/user.mock";
import { Application } from "express";
import appPromise from "../index";

let app: Application;

describe('/auth - Authentication Controller Tests', () => {
    let refreshToken: string;

    beforeAll(async () => {
        console.log("🚀 Starting test suite setup...");
        app = await appPromise;
        await UserModel.deleteMany();
        console.log("✅ Test suite setup complete.");
    });

    afterAll(async () => {
        console.log("🧹 Cleaning up after tests...");
        await UserModel.deleteMany();
        await mongoose.connection.close();
        console.log("✅ Cleanup complete. Closing database connection.");
    });

    describe('POST /auth/register - Register Tests', () => {
        const route = '/auth/register';

        it('✅ Should successfully register a new user', async () => {
            const response = await supertest(app).post(route).send(userMock1);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            console.log("User registration test passed.");
        });

        it('❌ Should fail registration with an existing username', async () => {
            const response = await supertest(app).post(route).send(userMock1);
            expect(response.status).toBe(400);
            console.log("Duplicate username test passed.");
        });

        it('❌ Should fail registration with missing fields', async () => {
            const response = await supertest(app).post(route).send({ username: userMock2 });
            expect(response.status).toBe(400);
            console.log("Validation error test passed.");
        });
    });

    describe('POST /auth/login - Login Tests', () => {
        const route = '/auth/login';

        it('✅ Should successfully log in an existing user', async () => {
            const response = await supertest(app).post(route).send(userMock1);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            refreshToken = response.body.refreshToken;
            console.log("Login successful.");
        });

        it('❌ Should fail login with a non-existing username', async () => {
            const response = await supertest(app).post(route).send(userMock2);
            expect(response.status).toBe(400);
            console.log("Non-existing username test passed.");
        });

        it('❌ Should fail login with an incorrect password', async () => {
            const response = await supertest(app).post(route).send({
                ...userMock1,
                password: 'wrong_password',
            });
            expect(response.status).toBe(400);
            console.log("Incorrect password test passed.");
        });

        it('❌ Should handle internal server error gracefully', async () => {
            jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
                throw new Error('Simulated Error');
            });

            const response = await supertest(app).post(route).send(userMock1);
            expect(response.status).toBe(400);
            console.log("Error handling test passed.");
        });
    });

    describe('POST /auth/refresh - Refresh Token Tests', () => {
        const route = '/auth/refresh';

        it('✅ Should refresh tokens successfully', async () => {
            const response = await supertest(app).post(route).send({ refreshToken });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            refreshToken = response.body.refreshToken;
            console.log("Token refresh successful.");
        });

        it('❌ Should fail token refresh with an invalid token', async () => {
            const response = await supertest(app).post(route).send({ refreshToken: 'invalid_token' });
            expect(response.status).toBe(400);
            console.log("Invalid token test passed.");
        });
    });

    describe('POST /auth/logout - Logout Tests', () => {
        const route = '/auth/logout';

        it('✅ Should successfully log out the user', async () => {
            const response = await supertest(app).post(route).send({ refreshToken });
            expect(response.status).toBe(200);
            console.log("Logout successful.");
        });

        it('❌ Should fail logout with the same token twice', async () => {
            const response = await supertest(app).post(route).send({ refreshToken });
            expect(response.status).toBe(400);
            console.log("Duplicate logout test passed.");
        });

        it('❌ Should fail logout with an invalid token', async () => {
            const response = await supertest(app).post(route).send({ refreshToken: 'invalid_token' });
            expect(response.status).toBe(400);
            console.log("Invalid token logout test passed.");
        });

        it('❌ Should fail logout without providing a token', async () => {
            const response = await supertest(app).post(route).send();
            expect(response.status).toBe(400);
            console.log("Missing token logout test passed.");
        });

        it('❌ Should fail logout for a deleted user', async () => {
            await UserModel.deleteMany();
            const response = await supertest(app).post(route).send({ refreshToken });
            expect(response.status).toBe(400);
            console.log("Deleted user logout test passed.");
        });

        it('❌ Should handle internal server error during logout', async () => {
            jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
                throw new Error('Simulated Error');
            });

            const response = await supertest(app).post(route).send({ refreshToken });
            expect(response.status).toBe(400);
            console.log("Logout error handling test passed.");
        });
    });
});
