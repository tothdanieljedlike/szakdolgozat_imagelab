import {existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync} from 'fs';
import {join, resolve} from 'path';
import {debug} from '../debug';

export const appDir = resolve(join(__dirname, '/../../'));
export const publicDir = join(appDir, 'public');
export const exportsDir = join(publicDir, 'exports');

export function isDir(location: string): boolean {
    return existsSync(location) && lstatSync(location).isDirectory();
}

export function rmDirSync(location: string) {
    if (existsSync(location)) {
        readdirSync(location, 'utf8').forEach(file => {
            const filePath = join(location, file);
            if (isDir(filePath)) {
                rmDirSync(filePath);
            } else {
                unlinkSync(filePath);
            }
        });
        rmdirSync(location);
    } else {
        debug('Delete directory failed: no such directory: ' + location);
    }
}
