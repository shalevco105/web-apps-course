import mongoose from "mongoose";
import request from 'supertest';
import { app } from '../index';



afterAll((done) => {
    mongoose.connection.close();
    app.listen(() => {}).close()
    done();
});

describe("General", () => {
    test("checking app status", async () => {
        const res = await request(app).get("/status")
        expect(res.statusCode).toEqual(200);
    });
});