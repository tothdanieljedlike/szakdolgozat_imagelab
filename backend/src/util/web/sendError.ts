export function sendError(message: string | any) {
    return Promise.reject(new Error(typeof message === 'string' ?  message : JSON.stringify(message)));
}
