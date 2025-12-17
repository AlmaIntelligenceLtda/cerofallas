import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import formidable from 'formidable';
import { NextResponse } from 'next/server';

export const runtime = "nodejs";

const mkdir = promisify(fs.mkdir);

export async function POST(req: Request) {
    try {
        const uploadDir = process.env.PHOTO_UPLOAD_PATH || '/var/www/fotos';

        // ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const form = new formidable.IncomingForm({
            multiples: true,
            uploadDir,
            keepExtensions: true,
            maxFileSize: 50 * 1024 * 1024 // 50MB
        });

        const parse = () =>
            new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
                form.parse((req as any).rawBody || (req as any), (err, fields, files) => {
                    if (err) return reject(err);
                    resolve({ fields, files });
                });
            });

        // In Next.js app router we need to convert the Request to Node IncomingMessage for formidable.
        // The simplest approach is to get the buffer and feed formidable via a fake stream.
        const buffer = Buffer.from(await req.arrayBuffer());
        const stream = require('stream');
        const r = new stream.PassThrough();
        r.end(buffer);

        // attach necessary properties so formidable can parse
        (r as any).headers = Object.fromEntries(req.headers.entries ? req.headers.entries() : req.headers);
        (r as any).url = req.url || '';

        // override form.parse to use our stream
        const parseWithStream = () =>
            new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
                form.parse(r as any, (err, fields, files) => {
                    if (err) return reject(err);
                    resolve({ fields, files });
                });
            });

        const { files } = await parseWithStream();

        const saved: Array<{ field: string; filename: string; path: string; size: number }> = [];

        for (const [field, fileVal] of Object.entries(files || {})) {
            if (!fileVal) continue;
            if (Array.isArray(fileVal)) {
                for (const f of fileVal) {
                    saved.push({ field, filename: path.basename(f.filepath || f.path || ''), path: f.filepath || f.path || '', size: f.size || 0 });
                }
            } else {
                const f = fileVal as any;
                saved.push({ field, filename: path.basename(f.filepath || f.path || ''), path: f.filepath || f.path || '', size: f.size || 0 });
            }
        }

        // Construir URLs públicas para las imágenes guardadas.
        // Preferir variable de entorno PHOTO_BASE_URL, si no usar un host por defecto.
        const defaultBase = process.env.PHOTO_BASE_URL || 'http://165.227.14.82/uploads';
        const baseUrl = (process.env.PHOTO_BASE_URL || defaultBase).replace(/\/$/, '');

        const urls = saved.map(s => `${baseUrl}/${s.filename}`);

        // Si solo se guardó un archivo, devolver una cadena con la URL (compatibilidad con cliente actual).
        if (urls.length === 1) {
            return NextResponse.json(urls[0]);
        }

        return NextResponse.json(urls);
    } catch (err: any) {
        console.error('Upload error', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}
