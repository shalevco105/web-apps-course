import {IUser} from "../models/userModel";

export const userMock1: IUser = {
    username: 'username',
    email: 'example01@gmail.com',
    password: 'password',
    refreshToken: 'refresh_token_123',
};

export const userMock2: IUser = {
    username: 'username2',
    email: 'example02@gmail.com',
    password: 'password2',
    refreshToken: null,
};
