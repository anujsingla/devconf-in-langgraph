import { writeFile } from 'fs/promises';

export function stringify(json: object | void | unknown) {
    return JSON.stringify(json, null, '');
}

export function parseJson(jsonString: string) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        // console.error("Invalid JSON string:", error.message);
        return jsonString;
    }
}

export function createError(message: string, originalArgs?: object, hints?: string[], code?: number) {
    return {
        errors: [
            {
                code,
                message,
                originalArgs,
                hints,
            },
        ],
    };
}

export async function storePng(image: Blob, filename: string) {
    const arrayBuffer = await image.arrayBuffer();
    await writeFile(filename, new Uint8Array(arrayBuffer));
}
