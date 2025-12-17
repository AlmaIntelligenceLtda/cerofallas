import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const formId = searchParams.get('formId');

  if (!userId || !formId) {
    return Response.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    const rows = await sql`
      SELECT id, form_data
      FROM mto_progreso
      WHERE user_id = ${userId}
      AND form_tipo = 'mantenimiento'
      AND form_id = ${formId}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return Response.json({ form_data: null });
    }

    return Response.json({ id: rows[0].id, form_data: rows[0].form_data });
  } catch (error) {
    console.error('Error al recuperar progreso:', error);
    return Response.json({ error: 'Error al recuperar progreso' }, { status: 500 });
  }
}
