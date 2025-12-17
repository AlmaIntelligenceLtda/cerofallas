import { neon } from '@neondatabase/serverless';
import axios from 'axios';

const PHOTO_SERVER = process.env.PHOTO_SERVER || 'http://165.227.14.82';

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = formData.get('user_id')?.toString();
  const progresoId = Number(formData.get('progreso_id'));
  const formDataRaw = formData.get('formData')?.toString();

  console.log('📦 user_id:', userId);
  console.log('📦 progreso_id:', progresoId);
  console.log('📦 formData crudo:', formDataRaw);

  if (!userId || !formDataRaw) {
    return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsedFormData = JSON.parse(formDataRaw);
  const fotografico = parsedFormData.fotografico || [];
  const folderName = `mto_fotografico_${Date.now()}`;
  const fotosProcesadas: { campo: string; descripcion: string; uri: string }[] = [];

  console.log('🖼️ Fotos recibidas:', fotografico);

  for (let i = 0; i < fotografico.length; i++) {
    const item = fotografico[i];
    const file = formData.get(`foto_${i}`) as File;

    console.log(`📂 Procesando foto_${i}:`, {
      campo: item.campo,
      descripcion: item.descripcion,
      fileOk: !!file,
    });

    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadForm = new FormData();

      uploadForm.append('folderName', folderName);
      uploadForm.append(
        'imagen',
        new Blob([buffer], { type: file.type }),
        file.name || `foto_${i}.jpg`
      );

      try {
        const resp = await axios.post(`${PHOTO_SERVER}/api/fotos/upload`, uploadForm, {
          maxBodyLength: Infinity,
        });

        const data = resp.data;
        const url = typeof data === 'string' ? data : data?.url;

        console.log(`✅ URL subida [foto_${i}]:`, url);

        if (typeof url === 'string' && url.startsWith('http')) {
          fotosProcesadas.push({
            campo: item.campo,
            descripcion: item.descripcion,
            uri: url,
          });
        } else {
          console.error(`❌ Error subiendo foto ${i}:`, data);
        }
      } catch (err) {
        console.error(`❌ Axios error al subir foto ${i}:`, err);
      }
    } else {
      console.warn(`⚠️ Foto ${i} no procesada correctamente`, file);
    }
  }

  parsedFormData.fotografico = fotosProcesadas;

  const respuestas = Object.entries(parsedFormData).filter(
    ([k, v]) => k !== 'fotografico' && v && v !== ''
  );
  const completo = respuestas.length >= 10 && fotosProcesadas.length >= 1;

  console.log('✅ Formulario completo:', completo);
  console.log('📸 Fotos procesadas:', fotosProcesadas);

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const result = await sql`
      INSERT INTO mto_preventivo (
        user_id,
        nombre_sitio,
        codigo_sitio,
        direccion,
        ciudad,
        region,
        id_acceso1,
        id_acceso2,
        numero_crq,
        numero_incidencia,
        empresa_ejecutante,
        nombre_tecnico,
        nombre_supervisor,
        fecha_ejecucion,
        tipo_equipo,
        marca_equipo,
        numero_serie,
        tipo_mantenimiento,
        horometro,
        resumen_trabajo,
        adjunta_comprobante,
        cantidad_hojas,
        form_data,
        photos,
        completo
      ) VALUES (
        ${userId},
        ${parsedFormData.nombreSitio},
        ${parsedFormData.codigoSitio},
        ${parsedFormData.direccion},
        ${parsedFormData.ciudad},
        ${parsedFormData.region},
        ${parsedFormData.idAcceso1},
        ${parsedFormData.idAcceso2},
        ${parsedFormData.numeroCrq},
        ${parsedFormData.numeroIncidencia},
        ${parsedFormData.empresaEjecutante},
        ${parsedFormData.nombreTecnico},
        ${parsedFormData.nombreSupervisor},
        ${parsedFormData.fechaEjecucion},
        ${parsedFormData.tipoEquipo},
        ${parsedFormData.marcaEquipo},
        ${parsedFormData.numeroSerie},
        ${parsedFormData.tipoMantenimiento},
        ${parsedFormData.horometro},
        ${parsedFormData.resumenTrabajo},
        ${parsedFormData.adjuntaComprobante},
        ${parsedFormData.cantidadHojas},
        ${parsedFormData},
        ${JSON.stringify(fotosProcesadas)},
        ${completo}
      ) RETURNING id;
    `;

    const nuevoFormId = result[0]?.id;

    console.log('📥 Formulario guardado con ID:', nuevoFormId);

    if (progresoId && nuevoFormId) {
      await sql`
        UPDATE mto_progreso
        SET form_id = ${nuevoFormId}, completo = ${completo}, actualizado_en = NOW()
        WHERE id = ${progresoId};
      `;
      console.log('🔄 Progreso actualizado:', progresoId);
    }

    return new Response(JSON.stringify({ success: true, id: nuevoFormId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error al guardar mantenimiento:', err);
    return new Response(JSON.stringify({ error: 'Error al guardar mantenimiento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
