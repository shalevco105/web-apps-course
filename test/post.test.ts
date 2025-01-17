import mongoose, { Types } from 'mongoose';
import supertest from 'supertest';
import Post from "../src/models/postModel";
import {app} from "../index";
import request from "supertest";
import {userMock1} from "../src/__mocks__/user.mock";

const mockPost = {
    title: 'Test Post',
    content: 'This is a test post',
    sender_id: new Types.ObjectId().toString(),
};

describe('/posts - Posts Controller', () => {
    let token: string;
    let postId: string;

    //     const response = await request(app).post("/api/auth/login").send(userMock1);
    //     expect(response.status).toBe(201);
    //     const cookie = response.headers['set-cookie'];
    //     expect(cookie).toBeDefined();
    //     expect(cookie[0]).toContain('refreshToken');
    //     expect(cookie[1]).toContain('accessToken');
    //     token = cookie[0].split(';')[0].split('=')[1];

    beforeAll(async () => {
        token = 'token'; //TODO: fix token
        await Post.deleteMany();
    });

    afterAll(async () => {
        await Post.deleteMany();
        await mongoose.connection.close();
    });

    describe('POST /posts', () => {
        it('should create a new post', async () => {
            const response = await supertest(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(mockPost);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe(mockPost.title);
            postId = response.body._id;
        });

        it('should fail to create a post without authorization', async () => {
            const response = await supertest(app).post('/posts').send(mockPost);
            expect(response.status).toBe(404);
        });

        it('should fail to create a post with missing fields', async () => {
            const response = await supertest(app)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(404);
        });
    });

    describe('GET /posts/data', () => {
        it('should retrieve all posts', async () => {
            const response = await supertest(app)
                .get('/posts/data')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /posts/:post_id', () => {
        it('should retrieve a single post by ID', async () => {
            const response = await supertest(app)
                .get(`/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', postId);
        });

        it('should return 404 for a non-existing post ID', async () => {
            const fakeId = new Types.ObjectId().toString();
            const response = await supertest(app)
                .get(`/posts/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
    });

    describe('GET /posts?sender=<sender_id>', () => {
        it('should retrieve posts by sender ID', async () => {
            const response = await supertest(app)
                .get(`/posts?sender=${mockPost.sender_id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('sender_id', mockPost.sender_id);
        });
    });

    describe('PUT /posts/:post_id', () => {
        it('should update a post', async () => {
            const updatedData = { title: 'Updated Title' };
            const response = await supertest(app)
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', updatedData.title);
        });

        it('should return 404 for updating a non-existing post', async () => {
            const fakeId = new Types.ObjectId().toString();
            const response = await supertest(app)
                .put(`/posts/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Should not update' });
            expect(response.status).toBe(404);
        });
    });
});
