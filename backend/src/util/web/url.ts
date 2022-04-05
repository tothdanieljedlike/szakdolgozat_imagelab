import {publicDir} from '../fs/fs';

export function makePublicUrl(originalUrl: string, injectSlash = false) {
    return originalUrl.replace(publicDir, injectSlash ? '/' : '');
}
