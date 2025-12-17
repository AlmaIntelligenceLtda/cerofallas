import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const strPendientes = await sql`
            SELECT form_id, form_tipo, titulo, TO_CHAR(actualizado_en, 'DD/MM/YYYY') AS fecha
            FROM str_progreso
            WHERE user_id = ${userId} AND completo = false
            ORDER BY actualizado_en DESC;
        `;

    const mtoPendientes = await sql`
            SELECT form_id, form_tipo, titulo, TO_CHAR(actualizado_en, 'DD/MM/YYYY') AS fecha
            FROM mto_progreso
            WHERE user_id = ${userId} AND completo = false
            ORDER BY actualizado_en DESC;
        `;

    const pendientes = [...strPendientes, ...mtoPendientes];

    return Response.json(pendientes);
  } catch (error) {
    console.error('Error al consultar pendientes:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
