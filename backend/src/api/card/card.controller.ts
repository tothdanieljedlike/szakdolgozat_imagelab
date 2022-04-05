import {existsSync, readdirSync, readFileSync, unlinkSync} from 'fs';
import {join, resolve} from 'path';
import {
    Authorized,
    Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, Req, Res, UploadedFile,
} from 'routing-controllers';
import * as upath from 'upath';
import {ReCaptchaMiddleware} from '../../service/recaptcha/recaptcha.middleware';
import {SuperController} from '../../super/super.controller';
import {Card} from '../../types/card';
import {CardComment} from '../../types/comment';
import {Map} from '../../types/map';
import {ROLES, User} from '../../types/user';
import {debug} from '../../util/debug';
import {uploadOptions} from '../../util/fileupload-options';
import {isDir, publicDir, rmDirSync} from '../../util/fs/fs';
import {parseCSV} from '../../util/fs/parse-csv';
import {unzip} from '../../util/fs/unzip';
import {forEach} from '../../util/object/forEach';
import {parseNumber} from '../../util/object/parseNumber';
import {sendError} from '../../util/web/sendError';
import {makePublicUrl} from '../../util/web/url';
import {CardCommentController} from '../card-comment/card-comment.controller';
import {MapController} from '../map/map.controller';
import {RatingController} from '../rating/rating.controller';
import {CardModel} from './card.model';
import {CardRepository} from './card.repository';

const projectMainFileName = 'data.csv';
const subMainFileName = 'teaching.csv';
const exportExtension = '.zip';

@JsonController('/card')
export class CardController extends SuperController<CardModel> {
    constructor() {
        super(new CardRepository(CardModel));
    }

    @Get()
    getAll(): Promise<CardModel[]> {
        return super.getAll();
    }

    @Get('/id/:id')
    getById(@Param('id') id: number): Promise<CardModel> {
        return super.getById(id);
    }

    @Put('/id/:id')
    @Authorized()
    async update(
        @Param('id') id: number,
        @Body({required: true}) item: Card,
        @CurrentUser({required: true}) user: User): Promise<CardModel> {

        await CardController.canAccess(item, user);
        return super.update(id, item as CardModel);
    }

    @Post()
    @Authorized()
    async add(
        @UploadedFile('export', { options: uploadOptions }) file: any,
        @CurrentUser({required: true}) user: User,
        @Req() req: any,
        @Res() res: any): Promise<CardModel> {
        const validator = new ReCaptchaMiddleware();
        try {
            await validator.verify(req);
        } catch (error) {
            return ReCaptchaMiddleware.sendValidationError(res);
        }

        if (!file) {
            return Promise.reject('missing file');
        }
        const dir = await unzip(file.path, join(file.destination, file.filename.replace(exportExtension, '')));
        if (!existsSync(dir)) {
            return Promise.reject('extracting failed');
        }
        if (!isDir(dir)) {
            unlinkSync(dir);
            return Promise.reject('invalid zip');
        }
        const readDir = readdirSync(dir);
        if (readDir.indexOf(projectMainFileName) === -1) {
            return CardController.addFallback('missing project file', dir);
        }
        const csv = parseCSV(readFileSync(join(dir, projectMainFileName), 'utf-8'));
        if (!csv.length) {
            return CardController.addFallback('empty project file', dir);
        }
        let projectName: string;
        if (csv[0].length === 1 && csv[0][0]) {
            projectName = csv[0][0];
        } else {
            return CardController.addFallback('bad first row in project file', dir);
        }
        const card: Card = {
            name: req.body.name || projectName,
            maps: [],
            comments: [],
            author: user,
            description: req.body.description,
            downloadLink: upath.normalize(makePublicUrl(file.path, false)),
            ratings: [],
        };
        for (let line = 1; line < csv.length - 1; line++) {
            const id = csv[line][0];
            if (csv[line].length === 6 && readDir.indexOf(id) > -1) {
                const fullPath = join(dir, id);
                const teachingPath = join(fullPath, subMainFileName);
                const map: Map = {
                    id:     null,
                    name:   csv[line][3],
                    lat:    parseNumber(csv[line][1]),
                    lng:    parseNumber(csv[line][2]),
                    imageSrc: upath.normalize(join(makePublicUrl(fullPath), '01.bmp')),
                };
                delete map.id; // because cascade
                if (!existsSync(fullPath)) {
                    return CardController.addFallback('missing ' + map.imageSrc + ' folder', dir);
                }
                if (!existsSync(teachingPath)) {
                    return CardController.addFallback('missing ' + subMainFileName, dir);
                }
                // const teaching = parseCSV(fs.readFileSync(teachingPath, 'utf-8'));
                card.maps.push(map);
            } else {
                return CardController
                    .addFallback('missing directory or property in project file at line: ' + line, dir);
            }
        }
        return super.add(card as CardModel);
    }

    @Delete('/id/:id')
    @Authorized()
    async delete(
        @Param('id') id: number,
        @CurrentUser({required: true}) user: User): Promise<CardModel> {

        const item = await this.getById(id);
        await CardController.canAccess(item, user);

        const targetDir = resolve(join(publicDir, item.downloadLink.replace(exportExtension, '')));
        debug(targetDir);
        const mapController = new MapController();
        await forEach(item.maps, map => {
            return mapController.delete(map.id);
        });

        const ratingController = new RatingController();
        await forEach(item.ratings, rating => {
            return ratingController.delete(rating.id);
        });

        const commentController = new CardCommentController();
        await forEach(await commentController.getByCardId(item.id), (comment: CardComment) => {
            return commentController.delete(comment.id, user);
        });

        const result = await super.delete(item as CardModel);
        if (!isDir(targetDir)) {
            debug('missing folder ' + targetDir); // return sendError('Missing folder');
        }
        try {
            rmDirSync(targetDir);
        } catch (err) {
            debug(err);
            return Promise.reject('remove failed');
        }
        return result;
    }

    static addFallback(errorMessage: string, cleanUpDir?: string): Promise<never> {
        if (cleanUpDir) {
            rmDirSync(cleanUpDir);
        }
        return Promise.reject(new Error(errorMessage));
    }

    static canAccess(item: Card, user: User) {
        if (!item || !user) {
            debug(item);
            debug(user);
            return sendError('Missing data');
        }
        if (item.author.id === user.id) { return Promise.resolve(); }
        if (user.role === ROLES.ADMIN) { return Promise.resolve(); }
        return sendError('Access denied');
    }
}
