import {IsEmail, MinLength} from 'class-validator';
import {Card} from './card';
import {Organization} from './organization';

export const enum ROLES {
    USER = 'user',
    ADMIN = 'admin',
}

export class User {
    id: number = null;

    @MinLength(3)
    firstName: string;

    @MinLength(3)
    lastName: string;

    @IsEmail()
    email: string;

    password: string;

    token: string;

    organization: Organization;

    role: ROLES = ROLES.USER;

    cards?: Card[];
}
