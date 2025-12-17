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

  console.log('Text received:', text);

  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const image = await loadImage(buffer);

    const width = image.width;
    const height = image.height;
    console.log('Image width:', width, 'height:', height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, width, height);

    const stampHeight = 170;
    const textStartY = height >= stampHeight ? height - stampHeight + 10 : 10;
    const rectY = height >= stampHeight ? height - stampHeight : 0;

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#000';
    ctx.fillRect(10, rectY, width - 20, stampHeight);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    console.log('Lines:', lines);
    lines.forEach((line, i) => {
      ctx.fillText(line, 20, textStartY + i * 36);
    });

    // Convertir Buffer a Uint8Array para NextResponse
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
