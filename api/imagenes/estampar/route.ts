import { createCanvas, loadImage } from 'canvas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Use the native Web API to get form data
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const text = formData.get('text') as string | null;

    if (!file || !text) {
      return NextResponse.json({ error: 'Missing image or text' }, { status: 400 });
    }

    // 2. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Load image and setup canvas
    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // ... (Your drawing logic remains the same) ...
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const stampHeight = Math.min(170, image.height * 0.25);
    const rectY = image.height - stampHeight;
    const padding = Math.max(10, image.height * 0.01);

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#000';
    ctx.fillRect(padding, rectY, image.width - padding * 2, stampHeight);
    ctx.globalAlpha = 1;

    let fontSize = Math.min(20, stampHeight / 4);
    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    if (lines.length * (fontSize + 2) + padding * 2 > stampHeight) {
      fontSize = (stampHeight - padding * 2) / lines.length - 2;
      ctx.font = `${fontSize}px monospace`;
    }

    lines.forEach((line, i) => {
      const y = rectY + padding + i * (fontSize + 2);
      ctx.fillText(line, padding * 2, y);
    });

    // 4. Return the image
    const outputBuffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    });

  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}