import {IComment} from "../models/commentModel";

export const commentMock1: IComment = {
    message: 'This is a test comment',
    sender_id: 'user123',
    post_id: 'post456',
};

export const commentMock2: IComment = {
    message: 'Another test comment',
    sender_id: 'user789',
    post_id: 'post456',
};
