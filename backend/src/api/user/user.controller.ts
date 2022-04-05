import * as bcrypt from 'bcryptjs';
import * as emailValidator from 'email-validator';
import {Response} from 'express';
import * as owasp from 'owasp-password-strength-test';
import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam, Req,
    Res, UseBefore,
} from 'routing-controllers';
import auth, {ILoggedInData} from '../../service/auth/auth.service';
import {sendReminder, sendResetedPassword} from '../../service/email/reminder/reminder';
import {sendVerifyEmail} from '../../service/email/verify/verify';
import {ReCaptchaMiddleware} from '../../service/recaptcha/recaptcha.middleware';
import { isUniversity } from '../../service/verify_institute/university_domain';
import {SuperController} from '../../super/super.controller';
import {ROLES, User} from '../../types/user';
import {UserLogin} from '../../types/user-login';
import {genHash} from '../../util/gen-hash';
import {forEach} from '../../util/object/forEach';
import {sendError} from '../../util/web/sendError';
import {CardCommentController} from '../card-comment/card-comment.controller';
import {CardController} from '../card/card.controller';
import {RatingController} from '../rating/rating.controller';
import {UserModel} from './user.model';
import {UserRepository} from './user.repository';

interface IMessage {
    message: string;
}

function checkPassword(password: string): Promise<any> {
    if (!password) { return sendError('Missing password field'); }

    const res = owasp.test(password);

    if (res.strong) { return Promise.resolve(); }
    return sendError(res.errors);
}

function checkEmail(email: string): Promise<any> {
    if (!email) {return sendError('Missing email field'); }
    if (emailValidator.validate(email)) { return Promise.resolve(); }
    return sendError('Invalid email address');
}

@JsonController('/user')
export class UserController extends SuperController<UserModel> {
    constructor() {
        super(new UserRepository(UserModel));
    }

    async auth(email: string, password: string) {
        if (!email || !password) {
            return null;
        }
        const user = await this.getByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return null;
        }
        return user;
    }

    getByEmail(email: string) {
        return (this.repository as UserRepository).getByEmail(email);
    }

    @Post('/login')
    login(@Body({ required: true }) item: UserLogin): Promise<ILoggedInData>  {
        return auth.login(item);
    }

    @Post('/logout')
    logout(
        @CurrentUser({ required: true }) user: User,
        @Req() req: any,
        @Res() res: Response): void {

        req.session.destroy();
        req.logout();
        return res.redirect('/login');
    }

    @Get('/reminder')
    async reminder(@QueryParam('email') email: string): Promise<IMessage> {
        await !checkEmail(email);
        const targetUser = await this.getByEmail(email);
        if (!targetUser) {
            return Promise.reject('this email address not exist');
        }
        if (targetUser.reset !== '') {
            return Promise.reject('this user already has a pending request');
        }
        const hash = genHash();
        targetUser.reset = hash;
        await super.update(targetUser.id, targetUser);
        await sendReminder(targetUser.email, hash);
        return {message: 'sent'};
    }

    @Get('/reminder/verify')
    async reminderVerify(
        @QueryParam('token') token: string,
        @Res() res: Response,
    ): Promise<void> {
        const usersByToken = await (this.repository as UserRepository).getByResetToken(token);

        if (usersByToken.length !== 1) {
            return res.redirect('/login;validation=invalid');
        }

        const targetUser = usersByToken[0];

        const hash = genHash();
        const update = await (this.repository as UserRepository).resetUserPassword(token, bcrypt.hashSync(hash));
        await sendResetedPassword(targetUser.email, hash);
        if (update.affected > 0) {
            return res.status(200).redirect(`/login;validation=ok;email=${targetUser.email}`);
        }

        return res.redirect('/login;validation=error');
    }

    @Get('/me')
    @Authorized()
    getMe(@CurrentUser({ required: true }) user: User): Promise<User> {
        return this.repository.getById(user.id);
    }

    @Get('/validate')
    async validate(
        @QueryParam('token') token: string,
        @Res() res: Response,
    ): Promise<void> {
        const usersByToken = await (this.repository as UserRepository).getByToken(token);

        if (usersByToken.length !== 1) {
            return res.redirect('/login;validation=invalid');
        }
        let uni = isUniversity(usersByToken[0].email);
        const update = await (this.repository as UserRepository).validateUser(token, uni);
        if (update.affected > 0) {
            return res.status(200).redirect(`/login;validation=ok;email=${usersByToken[0].email}`);
        }

        return res.redirect('/login;validation=error');
    }

    @Get()
    @Authorized(ROLES.ADMIN)
    getAll(): Promise<UserModel[]> {
        return super.getAll();
    }

    @Get('/id/:id')
    @Authorized(ROLES.ADMIN)
    getById(@Param('id') id: number): Promise<UserModel> {
        return super.getById(id);
    }

    @Put('/id/:id')
    @Authorized()
    async update(
        @Param('id') id: number,
        @Body({ required: true }) item: User,
        @CurrentUser({ required: true}) user: User): Promise<UserModel> {

        await UserController.canAccess(item, user);
        await checkEmail(item.email);
        if (!isAdmin(user)) {
            item.role = (await this.getById(item.id)).role; // OVERWRITE
        }
        if (user.id === item.id && item.password) { // self password change
            await checkPassword(item.password);
            item.password = bcrypt.hashSync(item.password);
        } else {
            delete item.password;
        }
        const updated = await super.update(id, item as UserModel);
        delete updated.token;
        delete updated.password;
        return updated;
    }

    @Post()
    @UseBefore(ReCaptchaMiddleware)
    async add(@Body({required: true}) item: User): Promise<UserModel> {
        item.id = null; // PREVENT PREDEFINED ID
        item.role = ROLES.USER; // OVERWRITE ROLE
        if (!item.organization || !item.organization.name) { return sendError('Missing organization'); }
        await checkEmail(item.email);
        await checkPassword(item.password);
        item.password = bcrypt.hashSync(item.password);
        let token: string;
        do {
            token = genHash();
        } while ((await (this.repository as UserRepository).getByToken(token)).length > 0);
        item.token = token;
        const result = await (this.repository as UserRepository).add(item as UserModel);
        delete result.token;
        delete result.password;
        await sendVerifyEmail(item.email, token);
        return result;
    }

    @Delete('/id/:id')
    @Authorized()
    async delete(
        @Param('id') id: number,
        @CurrentUser({required: true}) user?: User): Promise<UserModel> {

        const item = await this.getFullUserById(id);
        await UserController.canAccess(item, user);

        const cardController = new CardController();
        await forEach(item.cards, card => {
            return cardController.delete(card.id, user);
        });

        const ratingController = new RatingController();
        await forEach(item.ratings, rating => {
            return ratingController.delete(rating.id, user);
        });

        const commentController = new CardCommentController();
        await forEach(item.comments, comment => {
            return commentController.delete(comment.id, user);
        });
        delete user.password;
        return super.delete(id, item);
    }

    getFullUserById(id: number) {
        return (this.repository as UserRepository).getFullUserById(id);
    }

    static canAccess(item: User, user: User) {
        if (!item || !user) { return sendError('Missing data'); }
        if (isAdmin(user)) {return Promise.resolve(); }
        if (item.id === user.id) { return Promise.resolve(); }
        return sendError('Access denied');
    }
}

export function isAdmin(user: User | User) {
    return user.role === ROLES.ADMIN;
}
