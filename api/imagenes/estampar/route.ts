import { createCanvas, loadImage } from 'canvas';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;
  const text = formData.get('text') as string;

  if (!file || !text) {
    return NextResponse.json({ error: 'Missing image or text' }, { status: 400 });
  }

  try {
    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const image = await loadImage(buffer);

    const width = image.width;
    const height = image.height;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Dibujar imagen base
    ctx.drawImage(image, 0, 0, width, height);

    // Configuración del sello negro
    const stampHeight = Math.min(170, height); // si la imagen es muy pequeña
    const rectY = height - stampHeight;
    const padding = 10;

    // Dibujar rectángulo negro semitransparente
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#000';
    ctx.fillRect(padding, rectY, width - padding * 2, stampHeight);
    ctx.globalAlpha = 1;

    // Configuración de texto
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace'; // fuente segura por defecto en Node
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    const lineHeight = 22;
    lines.forEach((line, i) => {
      const y = rectY + padding + i * lineHeight;
      ctx.fillText(line, padding * 2, y); // margen desde el borde
    });

    console.log('Finished drawing text');

    // Convertir Buffer a ArrayBuffer para NextResponse
    const outputBuffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
    const outputArrayBuffer = Uint8Array.from(outputBuffer).buffer;

    return new NextResponse(outputArrayBuffer, {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Error processing image', details: e.message },
      { status: 500 }
    );
  }
}
