import * as fs from 'fs';
let glob = '';
function setGlob(sglob: string) {
    glob = sglob;
}
function gGlob() {
    return glob;
}
function checkFile(basePath: string, path: string) {
    if (fs.existsSync(basePath + path + '.txt')) {
        const text = fs.readFileSync(basePath + path + '.txt', 'utf8');
        setGlob(text);
    } else {
        if (path.length < 2) {
            return 'Nincs ilyen egyetem';
        } else {
            const newPath = path.substring(0, path.lastIndexOf('/'));
            checkFile(basePath, newPath);
        }

    }
    return gGlob();
}
export function isUniversity(email: string) {
    const domain = email.substring(email.lastIndexOf('@') + 1);
    const path = domain.split('.').reverse().join('/');
    const basePath = process.cwd() + '/src/service/verify_institute/domains/';
    console.log('Uni: ' + checkFile(basePath, path));
    return checkFile(basePath, path);
}
