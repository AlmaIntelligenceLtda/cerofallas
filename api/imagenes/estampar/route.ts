import formidable from 'formidable';
import { createCanvas, loadImage } from 'canvas';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { RouteSegmentConfig } from 'next';

export const routeSegmentConfig: RouteSegmentConfig = {
    api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
    const form = new formidable.IncomingForm();

    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

    try {
        const file = data.files.image;
        const text = data.fields.text as string;

        if (!file || !text) {
            return NextResponse.json({ error: 'Missing image or text' }, { status: 400 });
        }

        const filePath = Array.isArray(file) ? file[0].filepath : (file as formidable.File).filepath;
        const image = await loadImage(filePath);

        const width = image.width;
        const height = image.height;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, width, height);

        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#000';
        ctx.fillRect(10, height - 180, width - 20, 170);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.textBaseline = 'top';

        const lines = text.split('\n');
        lines.forEach((line, i) => {
            ctx.fillText(line, 20, height - 170 + i * 36);
        });

        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });

        return new NextResponse(buffer, {
            status: 200,
            headers: { 'Content-Type': 'image/jpeg' },
        });
    } catch (e: any) {
        return NextResponse.json({ error: 'Error processing image', details: e.message }, { status: 500 });
    }
}
