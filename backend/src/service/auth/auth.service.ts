import * as jwt from 'jwt-simple';
import * as moment from 'moment';
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {UserController} from '../../api/user/user.controller';
import {IToken} from '../../types/token';
import {User} from '../../types/user';
import {UserLogin} from '../../types/user-login';
import {debug} from '../../util/debug';
import {sendError} from '../../util/web/sendError';

export interface ILoggedInData {
    token: string;
    expires: string;
    user: number;
}

class Auth {
    public initialize = () => {
        passport.use('jwt', this.getStrategy());
        return passport.initialize();
    }

    public authenticate = (req: any, res: any, next: any): Promise<User> => {
        //tslint:disable
        console.log('ide');

        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false, failWithError: true },
                (err, user: {id: number, username: string, role: string}, info) => {
                    if (err) { return reject(err); }
                    if (!user) { return reject(info); }
                    resolve(new UserController().getById(user.id));
                })(req, res, next);
        });
    }

    private genToken = (user: User): ILoggedInData => {
        const expires = moment().utc().add({ hours: +process.env.JWT_EXPIRES || 24 }).unix();
        const token = jwt.encode({
            exp: expires,
            id: user.id,
            username: user.email,
            role: user.role,
        } as IToken, process.env.JWT_SECRET);

        return {
            token,
            expires: moment.unix(expires).format(),
            user: user.id,
        };
    }

    public login = async (body: UserLogin) => {
        try {
            const user: User = await new UserController().auth(body.email, body.password);
            if (!user) { return sendError('Invalid login'); }

            return Promise.resolve(this.genToken(user));
        } catch (err) {
            debug(err);
            return sendError('Invalid credentials');
        }
    }

    private getStrategy = (): Strategy => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        };

        return new Strategy(params, async (req: any, payload: any, done: any) => {
            try {
                const user = await new UserController().getByEmail(payload.username);
                if (!user) {
                    return done(null, false, { message: 'The user in the token was not found' });
                }
                return done(null, { id: user.id, username: user.email, role: user.role });
            } catch (err) {
                return done(err);
            }
        });
    }

}

export default new Auth();
