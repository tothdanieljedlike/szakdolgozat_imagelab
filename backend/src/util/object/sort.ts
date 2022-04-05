export function sortByProp<T extends { [key: string]: any }, K extends keyof T>(array: T[], prop: K): T[] {
    return array.sort((a: T, b: T) => {
        return a[prop] - b[prop];
    });
}
