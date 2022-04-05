export function forEach<V>(
    obj: V[] | {[key: string]: V},
    task: (item: V, index?: number | string, original?: typeof obj) => void): Promise<any> {
    if (Array.isArray(obj)) {
        return Promise.all(obj.map(async (element, index, original) => {
            return await task(element, index, original);
        }));
    } else if (typeof obj === 'object') {
        return Promise.all(Object.keys(obj).map(async (element: string ) => {
            const numberIndex = +element;
            return await task(obj[element], numberIndex ? numberIndex : element, obj);
        }));
    } else {
        return Promise.reject(new TypeError('not supported type ' +  typeof obj));
    }
}
