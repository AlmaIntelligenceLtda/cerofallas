import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const formId = searchParams.get("formId");

    if (!userId || !formId) {
        return Response.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
        const result = await sql`
      SELECT form_data
      FROM str_progreso
      WHERE user_id = ${userId}
        AND form_tipo = 'caratula'
        AND form_id = ${formId}
      LIMIT 1;
    `;

        if (result.length === 0 || !result[0].form_data) {
            return Response.json({ form_data: null });
        }

        const parsed = typeof result[0].form_data === "string"
            ? JSON.parse(result[0].form_data)
            : result[0].form_data;

        return Response.json({ form_data: parsed });
    } catch (error) {
        console.error("Error al consultar progreso:", error);
        return Response.json({ error: "Error interno" }, { status: 500 });
    }
}
