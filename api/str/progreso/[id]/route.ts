import { neon } from '@neondatabase/serverless';

export async function GET(_: Request, { id }: { id: string }) {
  if (!id) {
    return Response.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const result = await sql`
      SELECT form_tipo, completo
      FROM str_progreso
      WHERE user_id = ${id}
        AND form_id = -1
        AND form_tipo IN ('caratula', 'checklist', 'fotografico')
    `;

    const caratula = result.find((r) => r.form_tipo === 'caratula')?.completo || false;
    const checklist = result.find((r) => r.form_tipo === 'checklist')?.completo || false;
    const fotografico = result.find((r) => r.form_tipo === 'fotografico')?.completo || false;

    return Response.json({
      caratula,
      checklist,
      fotografico,
    });
  } catch (error) {
    console.error('Error al consultar progreso STR:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
