// @ts-ignore
import {ExpressMiddlewareInterface} from 'routing-controllers';

export class ReCaptchaMiddleware implements ExpressMiddlewareInterface {
    private Recaptcha = require('express-recaptcha').RecaptchaV3;
    // import Recaptcha from 'express-recaptcha'
     verify(req: any) {
        return new Promise((resolve, reject) => {
            const recaptcha = new this.Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);
            recaptcha.verify(req, (error: any, data: any) => {
                if (!error) {
                    resolve(data);
                } else {
                    reject(error);
                }
            });
        });
    }

    static sendValidationError(res: any) {
        return res.status(400).send({
            message: 'ReCaptcha validation failed',
        });
    }

    async use(req: any, res: any, next?: (err?: any) => any) {
        try {
            await this.verify(req);
            return next();
        } catch (error) {
            return ReCaptchaMiddleware.sendValidationError(res);
        }
    }

}
