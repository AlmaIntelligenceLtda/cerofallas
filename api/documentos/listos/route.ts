import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const caratulas = await sql`
            SELECT *, 'caratula' AS form_tipo, TO_CHAR(created_at, 'DD/MM/YYYY') AS fecha
            FROM str_caratula
            WHERE user_id = ${userId}
        `;

    const checklists = await sql`
            SELECT *, 'checklist' AS form_tipo, TO_CHAR(creado_en, 'DD/MM/YYYY') AS fecha
            FROM str_checklist
            WHERE user_id = ${userId}
        `;

    const fotograficos = await sql`
            SELECT *, 'fotografico' AS form_tipo, TO_CHAR(creado_en, 'DD/MM/YYYY') AS fecha
            FROM str_fotografico
            WHERE user_id = ${userId}
        `;

    const mantenimientos = await sql`
            SELECT *, 'mantenimiento' AS form_tipo, TO_CHAR(created_at, 'DD/MM/YYYY') AS fecha
            FROM mto_preventivo
            WHERE user_id = ${userId}
        `;

    const conectividad = await sql`
            SELECT *, 'conectividad' AS form_tipo, TO_CHAR(created_at, 'DD/MM/YYYY') AS fecha
            FROM ctv_pcctdayf
            WHERE user_id = ${userId}
        `;

    const str = [
      ...caratulas.map((c) => ({ ...c, estado: 'listo' })),
      ...checklists.map((c) => ({ ...c, estado: 'listo' })),
      ...fotograficos.map((f) => ({ ...f, estado: 'listo' })),
    ];

    const mantenimiento = mantenimientos.map((m) => ({
      ...m,
      estado: 'listo',
    }));

    const conectividadList = conectividad.map((c) => ({
      ...c,
      estado: 'listo',
    }));

    return Response.json({
      conectividad: conectividadList,
      mantenimiento,
      str,
    });
  } catch (error) {
    console.error('Error al consultar documentos listos:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
