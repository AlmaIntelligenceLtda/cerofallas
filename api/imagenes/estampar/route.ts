import { IncomingForm } from 'formidable';
import fs from 'fs';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Parsear formData con formidable
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

  // Leer imagen a Buffer
  const buffer = fs.readFileSync(file.filepath);
  const image = await loadImage(buffer);

  // Crear canvas con tamaño de la imagen
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  // Dibujar imagen original
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Determinar rectángulo negro semitransparente
  const stampHeight = Math.min(170, image.height * 0.25);
  const rectY = image.height - stampHeight;
  const padding = Math.max(10, image.height * 0.01);

  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#000';
  ctx.fillRect(padding, rectY, image.width - padding * 2, stampHeight);
  ctx.globalAlpha = 1;

  // Ajustar tamaño de fuente dinámicamente
  let fontSize = Math.min(20, stampHeight / 4);
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';

  // Dividir texto en líneas y calcular altura
  const lines = text.split('\n');
  const lineHeight = fontSize + 2;

  // Reducir tamaño de fuente si hay muchas líneas
  if (lines.length * lineHeight + padding * 2 > stampHeight) {
    fontSize = (stampHeight - padding * 2) / lines.length - 2;
    ctx.font = `${fontSize}px monospace`;
  }

  lines.forEach((line, i) => {
    const y = rectY + padding + i * (fontSize + 2);
    ctx.fillText(line, padding * 2, y);
  });

  // Convertir a Uint8Array para NextResponse
  const outputBuffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
  const uint8Array = new Uint8Array(outputBuffer);

  return new NextResponse(uint8Array, {
    status: 200,
    headers: { 'Content-Type': 'image/jpeg' },
  });
}
