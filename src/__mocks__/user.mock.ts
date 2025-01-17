import {IUser} from "../models/userModel";

export const userMock1: IUser = {
    _id: '63f4ad2d59b7a812349af03a',
    username: 'username',
    email: 'example@gmail.com',
    password: 'password',
    refreshToken: 'refresh_token_123',
};

export const userMock2: IUser = {
    _id: '63f4ad2d59b7a812349af03b',
    username: 'username2',
    email: 'example2@gmail.com',
    password: 'password2',
    refreshToken: null,
};
