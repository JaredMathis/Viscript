import fs from 'fs';

export async function file_open(file_path) {
    return await fs.promises.readFile(file_path, 'utf-8');
}