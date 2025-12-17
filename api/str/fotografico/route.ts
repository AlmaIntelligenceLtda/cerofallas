import { neon } from '@neondatabase/serverless';
import axios from 'axios';

import { ecebbItems } from '@/constants'; // Asegúrate de importar esto correctamente

const PHOTO_SERVER = process.env.PHOTO_SERVER || 'http://165.227.14.82';

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = formData.get('userId')?.toString();
  const formDataRaw = formData.get('formData')?.toString();
  const progresoId = formData.get('progresoId')?.toString();

  if (!userId || !formDataRaw) {
    return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsedFormData = JSON.parse(formDataRaw);
  if (parsedFormData?.fotos) {
    delete parsedFormData.fotos; // Limpieza defensiva
  }

  const folderName = `fotografico_${Date.now()}`;
  const newPhotos: Record<string, string> = {};

  // Subida de fotos
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'object' && 'arrayBuffer' in value) {
      const file = value as File;
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadForm = new FormData();
      uploadForm.append('folderName', folderName);
      uploadForm.append('imagen', new Blob([buffer], { type: file.type }), file.name);

      try {
        const uploadResp = await axios.post(`${PHOTO_SERVER}/api/fotos/upload`, uploadForm, {
          maxBodyLength: Infinity,
        });

        const url = uploadResp.data;
        if (typeof url === 'string' && url.startsWith('http')) {
          newPhotos[key] = url;
        } else {
          console.error(`❌ Error al subir "${key}":`, url);
        }
      } catch (error) {
        console.error(`❌ Error subiendo "${key}" con axios:`, error);
      }
    }
  }

  const sql = neon(process.env.DATABASE_URL!);

  // 🔁 MERGE con fotos previas si hay progresoId
  let finalPhotos = { ...newPhotos };

  if (progresoId) {
    try {
      const result = await sql`
                SELECT photos FROM str_progreso
                WHERE id = ${progresoId} AND user_id = ${userId};
            `;
      const prevPhotos = result[0]?.photos || {};
      finalPhotos = { ...prevPhotos, ...newPhotos };
    } catch (err) {
      console.error('⚠️ Error trayendo fotos de progreso:', err);
    }
  }

  // ✅ Evaluar si está completo: Observaciones y todos los checklist (no importan fotos)
  const observaciones = parsedFormData?.observaciones?.trim();
  const todosItemsLlenos = ecebbItems.every((k) => parsedFormData[k]?.trim() !== '');
  const completo = !!observaciones && todosItemsLlenos;

  console.log('esta completo? respuesta:', completo);

  try {
    // Insertar en str_fotografico
    const result = await sql`
            INSERT INTO str_fotografico (user_id, form_data, photos, completo)
            VALUES (${userId}, ${parsedFormData}, ${finalPhotos}, ${completo})
            RETURNING id;
        `;

    const nuevoFormId = result[0]?.id;

    // Si progresoId existe, actualizar en str_progreso
    if (progresoId && nuevoFormId) {
      await sql`
                UPDATE str_progreso
                SET form_id = ${nuevoFormId}, completo = ${completo}
                WHERE id = ${progresoId};
            `;
    }

    return new Response(JSON.stringify({ success: true, id: nuevoFormId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error al guardar fotografico:', error);
    return new Response(JSON.stringify({ error: 'Error interno al guardar fotografico' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
