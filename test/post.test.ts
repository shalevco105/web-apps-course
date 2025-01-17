import mongoose, { Types } from 'mongoose';
import supertest from 'supertest';
import Post from "../src/models/postModel";
import {app} from "../index";
import request from "supertest";
import {userMock1} from "../src/__mocks__/user.mock";
import {UserModel} from "../src/models/userModel";

const mockPost = {
    title: 'Test Post',
    content: 'This is a test post',
    sender_id: new Types.ObjectId().toString(),
};

describe('/post - Post Controller', () => {
    let token: string;
    let postId: string;

    beforeAll(async () => {
        await request(app).post("/auth/register").send(userMock1);
        const response = await request(app).post("/auth/login").send(userMock1);
        token = (response.headers['set-cookie'])[0].split(';')[0].split('=')[1];
        console.log("token", token);
        await Post.deleteMany();
    });

    afterAll(async () => {
        await Post.deleteMany();
        await UserModel.deleteMany();
        await mongoose.connection.close();
    });

    describe('POST /post', () => {
        it('should create a new post', async () => {
            const response = await supertest(app)
                .post('/post')
                .set('Authorization', `Bearer ${token}`)
                .send(mockPost);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe(mockPost.title);
            postId = response.body._id;
        });

        it('should fail to create a post without authorization', async () => {
            const response = await supertest(app).post('/post').send(mockPost);
            expect(response.status).toBe(401);
        });

        it('should fail to create a post with missing fields', async () => {
            const response = await supertest(app)
                .post('/post')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(400);
        });
    });

    describe('GET /post/data', () => {
        it('should retrieve all post', async () => {
            const response = await supertest(app)
                .get('/post/data')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /post/:post_id', () => {
        it('should retrieve a single post by ID', async () => {
            const response = await supertest(app)
                .get(`/post/${postId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', postId);
        });

        it('should return 404 for a non-existing post ID', async () => {
            const fakeId = new Types.ObjectId().toString();
            const response = await supertest(app)
                .get(`/post/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
    });

    describe('GET /post?sender=<sender_id>', () => {
        it('should retrieve post by sender ID', async () => {
            const response = await supertest(app)
                .get(`/post?sender=${mockPost.sender_id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('sender_id', mockPost.sender_id);
        });
    });

    describe('PUT /post/:post_id', () => {
        it('should update a post', async () => {
            const updatedData = { title: 'Updated Title' };
            const response = await supertest(app)
                .put(`/post/${postId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', updatedData.title);
        });

        it('should return 404 for updating a non-existing post', async () => {
            const fakeId = new Types.ObjectId().toString();
            const response = await supertest(app)
                .put(`/post/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Should not update' });
            expect(response.status).toBe(404);
        });
    });
});
