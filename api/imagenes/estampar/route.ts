import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Parsear formData
  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files?.image;
  const text = data.fields?.text;

  if (!file || !text) {
    return NextResponse.json({ error: 'Missing image or text' }, { status: 400 });
  }

  // Leer archivo
  const buffer = fs.readFileSync(file.filepath);
  const image = await loadImage(buffer);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  // Dibujar imagen base
  ctx.drawImage(image, 0, 0);

  // Rectángulo negro semi-transparente
  const stampHeight = Math.min(170, image.height);
  const rectY = image.height - stampHeight;
  const padding = 10;
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#000';
  ctx.fillRect(padding, rectY, image.width - padding * 2, stampHeight);
  ctx.globalAlpha = 1;

  // Texto
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.textBaseline = 'top';
  const lines = text.split('\n');
  const lineHeight = 22;
  lines.forEach((line, i) => ctx.fillText(line, padding * 2, rectY + padding + i * lineHeight));

  const outputBuffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });

  return new NextResponse(outputBuffer, {
    status: 200,
    headers: { 'Content-Type': 'image/jpeg' },
  });
}
