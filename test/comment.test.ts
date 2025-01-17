import mongoose, { Types } from 'mongoose';
import supertest from 'supertest';
import Comment from "../src/models/commentModel";
import { app } from "../index";
import request from "supertest";
import { userMock1 } from "../src/__mocks__/user.mock";
import { UserModel } from "../src/models/userModel";

const mockComment = {
    title: 'Test Comment',
    content: 'This is a test comment',
    sender_id: new Types.ObjectId().toString(),
};

describe('/comment - Comment Controller', () => {
    let token: string;
    let commentId: string;

    beforeAll(async () => {
        await request(app).post("/auth/register").send(userMock1);
        const response = await request(app).post("/auth/login").send(userMock1);
        
        token = (response.headers['set-cookie'])[1].split(';')[0].split('=')[1];
        await Comment.deleteMany();
    });

    afterAll(async () => {
        await Comment.deleteMany();
        await UserModel.deleteMany();
        await mongoose.connection.close();
    });

    describe('POST /comments', () => {
        it('should create a new comment', async () => {
            const response = await supertest(app)
                .post('/comments')
                .set('Authorization', `Bearer ${token}`)
                .send(mockComment);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe(mockComment.title);
            commentId = response.body._id;
        });

        it('should fail to create a comment without authorization', async () => {
            const response = await supertest(app).post('/comments').send(mockComment);
            expect(response.status).toBe(401);
        });

        it('should fail to create a comment with missing fields', async () => {
            const response = await supertest(app)
                .post('/comments')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(400);
        });
    });

    describe('GET /comments/data', () => {
        it('should retrieve all comment', async () => {
            const response = await supertest(app)
                .get('/comments/data')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /comments/:comment_id', () => {
        it('should retrieve a single comment by ID', async () => {
            const response = await supertest(app)
                .get(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', commentId);
        });

        it('should return 404 for a non-existing comment ID', async () => {
            const fakeId = new Types.ObjectId().toString();
            const response = await supertest(app)
                .get(`/comments/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
    });

    describe('GET /comments?sender=<sender_id>', () => {
        it('should retrieve comment by sender ID', async () => {
            const response = await supertest(app)
                .get(`/comments?sender=${mockComment.sender_id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('sender_id', mockComment.sender_id);
        });
    });

    describe('PUT /comments/:comment_id', () => {
        it('should update a comment', async () => {
            const updatedData = { title: 'Updated Title' };
            const response = await supertest(app)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', updatedData.title);
        });

        it('should return 404 for updating a non-existing comment', async () => {
            const fakeId = new Types.ObjectId().toString();
            const response = await supertest(app)
                .put(`/comments/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Should not update' });
            expect(response.status).toBe(404);
        });
    });
});
