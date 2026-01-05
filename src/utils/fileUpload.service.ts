// src/utils/fileUpload.service.ts

import path from 'path';
import fs from 'node:fs/promises';

const UPLOADS_DIR = path.join(__dirname, '../../uploads'); // Directory for uploaded files

export namespace FileUploadService {
    export const uploadImage = async (file: { originalname: string, buffer: Buffer }): Promise<string> => {
        // Ensure the uploads directory exists
        await fs.mkdir(UPLOADS_DIR, { recursive: true });

        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(UPLOADS_DIR, fileName);

        await fs.writeFile(filePath, file.buffer);

        // Construct the URL relative to the static serving path, which will be '/uploads'
        const imgUrl = `/api/v1/uploads/${fileName}`;

        console.log(`Image uploaded to: ${filePath}, URL: ${imgUrl}`);

        return imgUrl;
    };
}