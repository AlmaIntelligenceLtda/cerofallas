import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import { RouteSegmentConfig } from 'next';

// Nueva forma de configurar la ruta en Next.js 14
export const routeSegmentConfig: RouteSegmentConfig = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing form data' });
        }

        try {
            const file = files.image;
            const text = fields.text as string;

            if (!file || !text) {
                return res.status(400).json({ error: 'Missing image or text' });
            }

            const filePath = Array.isArray(file) ? file[0].filepath : (file as formidable.File).filepath;
            const image = await loadImage(filePath);

            const width = image.width;
            const height = image.height;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0, width, height);

            // Fondo negro semitransparente
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#000';
            ctx.fillRect(10, height - 180, width - 20, 170);
            ctx.globalAlpha = 1;

            // Texto blanco
            ctx.fillStyle = '#fff';
            ctx.font = '32px Arial';
            ctx.textBaseline = 'top';

            const lines = text.split('\n');
            lines.forEach((line, i) => {
                ctx.fillText(line, 20, height - 170 + i * 36);
            });

            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
            res.setHeader('Content-Type', 'image/jpeg');
            res.status(200).end(buffer);
        } catch (e: any) {
            res.status(500).json({ error: 'Error processing image', details: e.message });
        }
    });
}
