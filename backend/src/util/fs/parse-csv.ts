export function parseCSV(csv: string, separator?: string) {
    if (!separator) { separator = ';'; }
    const out = [];
    for (const row of csv.split('\r\n')) {
        out.push(row.split(separator));
    }
    return out;
}
