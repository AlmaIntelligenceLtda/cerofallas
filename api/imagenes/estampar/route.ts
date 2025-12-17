import { createCanvas, loadImage } from 'canvas';
import formidable from 'formidable';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  const data: { fields: any; files: any } = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const text = data.fields.text;
  const file = data.files.image;

  if (!text || !file) {
    return NextResponse.json({ error: 'Missing image or text' }, { status: 400 });
  }

  const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
  const image = await loadImage(filePath);

  const width = image.width;
  const height = image.height;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, width, height);

  // Dibujar rectángulo negro
  const stampHeight = Math.min(170, height);
  const rectY = height - stampHeight;
  const padding = 10;
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#000';
  ctx.fillRect(padding, rectY, width - padding * 2, stampHeight);
  ctx.globalAlpha = 1;

  // Texto
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.textBaseline = 'top';
  const lines = text.split('\n');
  const lineHeight = 22;
  lines.forEach((line, i) => {
    ctx.fillText(line, padding * 2, rectY + padding + i * lineHeight);
  });

  const outputBuffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
  const outputArrayBuffer = Uint8Array.from(outputBuffer).buffer;

  return new NextResponse(outputArrayBuffer, {
    status: 200,
    headers: { 'Content-Type': 'image/jpeg' },
  });
}
