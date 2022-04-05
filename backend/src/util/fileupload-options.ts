import {getExtension} from 'mime';
import * as multer from 'multer';
import {debug} from './debug';
import {exportsDir} from './fs/fs';

export const uploadOptions = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, exportsDir);
        },
        filename: (req, file, cb) => {
            cb(
                null,
                `${Date.now()}.zip`,
            );
        },
    }),
    fileFilter: (req: any, file: any, cb: any) => {
        debug(file.mimetype);
        const extension = getExtension(file.mimetype);
        debug(extension);
        if (extension === 'zip' || extension === 'bin' || file.mimetype === 'application/x-zip-compressed') {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    },
    limits: {
        files: +process.env.FILE_UPLOAD_MAX_FILE || 1,
        fieldNameSize: +process.env.FILE_UPLOAD_MAX_FILE_NAME || 255,
        fileSize: (+process.env.FILE_UPLOAD_MAX_FILE_SIZE || 1024) * 1024 * 1024,
    },
});
