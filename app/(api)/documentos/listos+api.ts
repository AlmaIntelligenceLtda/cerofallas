import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return Response.json({ error: "Missing user ID" }, { status: 400 });
    }

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        // STR: carátula
        const caratulas = await sql`
      SELECT 'caratula' AS form_tipo, TO_CHAR(created_at, 'DD/MM/YYYY') AS fecha
      FROM str_caratula
      WHERE user_id = ${userId}
    `;

        // STR: checklist
        const checklists = await sql`
      SELECT 'checklist' AS form_tipo, TO_CHAR(creado_en, 'DD/MM/YYYY') AS fecha
      FROM str_checklist
      WHERE user_id = ${userId}
    `;

        const str = [
            ...caratulas.map((c) => ({ ...c, estado: "listo" })),
            ...checklists.map((c) => ({ ...c, estado: "listo" })),
        ];

        return Response.json({
            conectividad: [],
            mantenimiento: [],
            str,
        });
    } catch (error) {
        console.error("Error al consultar documentos listos:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
