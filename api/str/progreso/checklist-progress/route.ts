import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  const { userId, titulo, formData } = await req.json();

  if (!userId || !titulo) {
    return Response.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }

  const completo = !!(
    formData.codigo &&
    formData.nombre &&
    formData.nombreProfesional &&
    formData.direccion
  );

  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    await sql`
            INSERT INTO str_progreso (
                user_id, form_tipo, form_id, titulo, completo, form_data, actualizado_en
            )
            VALUES (
                ${userId}, 'checklist', -1, ${titulo}, ${completo}, ${JSON.stringify(formData)}, NOW()
            )
            ON CONFLICT (user_id, form_tipo, form_id)
            DO UPDATE SET
                titulo = ${titulo},
                completo = ${completo},
                form_data = ${JSON.stringify(formData)},
                actualizado_en = NOW();
        `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error guardando progreso de checklist:', error);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
