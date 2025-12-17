import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const app = express();

app.post('/api/imagenes/estampar', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.image;
    const text = fields.text;
    if (!file || !text) return res.status(400).json({ error: 'Missing image or text' });

    try {
      const buffer = fs.readFileSync(file.filepath);
      const image = await loadImage(buffer);
      const width = image.width;
      const height = image.height;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Dibujar imagen
      ctx.drawImage(image, 0, 0, width, height);

      // Rectángulo negro
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
      lines.forEach((line, i) => ctx.fillText(line, padding * 2, rectY + padding + i * lineHeight));

      const output = canvas.toBuffer('image/jpeg', { quality: 0.8 });
      res.set('Content-Type', 'image/jpeg');
      res.send(output);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

app.listen(3001, () => console.log('Server listening on port 3001'));
