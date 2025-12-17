import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { NextResponse } from 'next/server';

export const routeSegmentConfig = {
  runtime: 'nodejs',
  bodyParser: false,
};

export async function POST(req: Request) {
  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files?.image;
  const text = data.fields?.text;
  if (!file || !text) return NextResponse.json({ error: 'Missing image or text' }, { status: 400 });

  const buffer = fs.readFileSync(file.filepath);
  const image = await loadImage(buffer);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
  ctx.fillStyle = '#000';
  ctx.globalAlpha = 0.6;
  ctx.fillRect(10, image.height - 170, image.width - 20, 160);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.textBaseline = 'top';
  text.split('\n').forEach((line, i) => ctx.fillText(line, 20, image.height - 160 + i * 22));

  return new NextResponse(canvas.toBuffer('image/jpeg'), {
    status: 200,
    headers: { 'Content-Type': 'image/jpeg' },
  });
}
