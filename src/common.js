import fs from 'fs';

export async function file_open(file_path) {
    return await fs.promises.readFile(file_path, 'utf-8');
}
export function json_parse(unparsed) {
    return JSON.parse(unparsed);
}
export async function file_json_open(file_path) {
    let unparsed = await file_open(file_path);
    return json_parse(unparsed);
}