import { neon } from '@neondatabase/serverless';
import axios from 'axios';

const PHOTO_SERVER = process.env.PHOTO_SERVER || 'http://165.227.14.82';

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = formData.get('user_id')?.toString();
  const progresoId = formData.get('progreso_id')?.toString();
  const formDataRaw = formData.get('formData')?.toString();

  if (!userId || !formDataRaw) {
    return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), { status: 400 });
  }

  const parsedFormData = JSON.parse(formDataRaw);
  const fotos = parsedFormData.fotos || {};

  const folderName = `ctv_conectividad_${Date.now()}`;
  const fotosFinal: Record<string, { campo: string; uri: string }[]> = {};

  for (const entry of formData.entries()) {
    const value = entry[1];
    const isFile = typeof value === 'object' && 'name' in value;
    console.log(`   • ${entry[0]}: ${isFile ? `[File] ${value.name}` : value}`);
  }

  const keys = Object.keys(fotos);

  for (let i = 0; i < keys.length; i++) {
    const campo = keys[i];
    const fotosArray = fotos[campo];
    const campoSanitizado = campo.replace(/\s+/g, '_').toLowerCase();

    for (let j = 0; j < fotosArray.length; j++) {
      const fieldName = `foto_${campoSanitizado}_${j}`;
      const file = formData.get(fieldName) as File;

      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadForm = new FormData();

        uploadForm.append('folderName', folderName);
        uploadForm.append(
          'imagen',
          new Blob([buffer], { type: file.type }),
          file.name || `foto_${campoSanitizado}_${j}.jpg`
        );

        try {
          const resp = await axios.post(`${PHOTO_SERVER}/api/fotos/upload`, uploadForm, {
            headers:
              typeof (uploadForm as any).getHeaders === 'function'
                ? (uploadForm as any).getHeaders()
                : {},
            maxBodyLength: Infinity,
          });

          const data = resp.data;
          const url = typeof data === 'string' ? data : data?.url;

          if (url?.startsWith('http')) {
            if (!fotosFinal[campoSanitizado]) fotosFinal[campoSanitizado] = [];

            fotosFinal[campoSanitizado].push({ campo: campoSanitizado, uri: url });
          } else {
            console.warn(`⚠️ Respuesta inesperada al subir ${fieldName}:`, data);
          }
        } catch (err) {
          console.error(`❌ Error al subir foto ${fieldName}:`, err);
        }
      } else {
        console.warn(`⚠️ Archivo no encontrado o inválido: ${fieldName}`);
      }
    }
  }

  const sql = neon(process.env.DATABASE_URL!);

  // 🔁 Recuperar fotos previas si existen
  let fotosPrevias: Record<string, { campo: string; uri: string }[]> = {};

  if (progresoId) {
    try {
      const prev = await sql`
        SELECT photos FROM ctv_progreso
        WHERE id = ${progresoId} AND form_tipo = 'conectividad'
      `;
      if (prev[0]?.photos) {
        fotosPrevias = prev[0].photos;
      }
    } catch (e) {
      console.error('⚠️ Error obteniendo fotos previas:', e);
    }
  }

  // ✅ Combinar fotos anteriores con nuevas
  const fotosCombinadas = { ...fotosPrevias };

  for (const campo in fotosFinal) {
    fotosCombinadas[campo] = fotosFinal[campo];
  }

  const camposLlenos = Object.entries(parsedFormData).filter(
    ([k, v]) =>
      k !== 'fotos' &&
      k !== 'resumenMedicionesAntes' &&
      k !== 'resumenMedicionesDespues' &&
      v &&
      v !== ''
  );
  const completo = camposLlenos.length >= 10 && Object.keys(fotosCombinadas).length >= 1;

  try {
    const result = await sql`
      INSERT INTO ctv_progreso (
        user_id,
        form_tipo,
        form_id,
        titulo,
        form_data,
        completo,
        actualizado_en,
        photos
      )
      VALUES (
        ${userId},
        'conectividad',
        -1,
        ${parsedFormData.siteName || 'Sin título'},
        ${JSON.stringify(parsedFormData)},
        ${completo},
        now(),
        ${JSON.stringify(fotosCombinadas)}
      )
      ON CONFLICT (user_id, form_tipo, form_id)
      DO UPDATE SET
        form_data = EXCLUDED.form_data,
        photos = EXCLUDED.photos,
        completo = EXCLUDED.completo,
        actualizado_en = now()
      RETURNING id, form_id;
    `;

    const nuevoProgresoId = result[0]?.id;
    const formIdAsignado = result[0]?.form_id;

    console.log('🆔 Progreso guardado con ID:', nuevoProgresoId);
    console.log('📄 Formulario ID real:', formIdAsignado);

    return new Response(
      JSON.stringify({
        success: true,
        id: nuevoProgresoId,
        form_id: formIdAsignado,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('❌ Error al guardar conectividad:', err);
    return new Response(JSON.stringify({ error: 'Error al guardar conectividad' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
