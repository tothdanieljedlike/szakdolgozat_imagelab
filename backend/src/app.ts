import {json, urlencoded} from 'body-parser';
import * as express from 'express';
import {readFileSync} from 'fs';
import * as https from 'https';
import * as logger from 'morgan';
import {join, resolve} from 'path';
import 'reflect-metadata';
import {useExpressServer} from 'routing-controllers';
import 'source-map-support/register';
import {createConnection} from 'typeorm';
import {AppModules} from './modules';
import {authorizationChecker, currentUserChecker} from './service/auth/auth.middleware';
import auth from './service/auth/auth.service';
import * as helmet from './service/helmet/helmet.middleware';
import {apiLimiter} from './service/limiter/limiter.middleware';
import {debug} from './util/debug';
import {appDir, publicDir} from './util/fs/fs';

const port = process.env.PORT || 443;
const app = express();

app.use('/api/', apiLimiter);
app.use(helmet.base);
app.use(helmet.referer);
app.use(auth.initialize());
app.use(logger(process.env.LOG_STYLE || 'dev'));
app.use(express.static(publicDir));
app.use(json());
app.use(urlencoded({ extended: true }));

createConnection().then(() => {
    const server = useExpressServer(app, {
        controllers: AppModules.Controllers,
        authorizationChecker,
        currentUserChecker,
        development: process.env.DEV === 'true',
        routePrefix: process.env.API_PREFIX || '/api',
    });

    // 404 => index.html
    server.use((req, res, next) => {
        res.sendFile(join(publicDir, 'index.html'));
    });

    const credentials = {
        key: readFileSync(
            resolve(appDir, '../', (process.env.HTTPS_KEY || 'server.key')), 'utf8'),
        cert: readFileSync(
            resolve(appDir, '../', (process.env.HTTPS_CERT || 'server.crt')), 'utf8'),
    };
    const httpsServer = https.createServer(credentials, server);

    httpsServer.listen(port, () => {
        debug('https://localhost:' + port);
    });
}).catch(err => {
    debug('DB ERROR: ' + (typeof err === 'string' ? err : JSON.stringify(err)));
}) ;
