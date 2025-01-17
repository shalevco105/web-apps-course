import {IComment} from "../models/commentModel";

export const commentMock1: IComment = {
    _id: '63f4ad2d59b7a812349af01a',
    message: 'This is a test comment',
    sender_id: 'user123',
    post_id: 'post456',
};

export const commentMock2: IComment = {
    _id: '63f4ad2d59b7a812349af01b',
    message: 'Another test comment',
    sender_id: 'user789',
    post_id: 'post456',
};
