import * as extract from 'extract-zip';

export function unzip(source: string, target: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            extract(source, {dir: target});
            resolve(target);
        } catch (error) {
            reject(error);
        }
    });
}
