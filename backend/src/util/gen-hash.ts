export function genHash(len = 32) {
    let hash = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < len; i++) {
        hash += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return hash;
}
