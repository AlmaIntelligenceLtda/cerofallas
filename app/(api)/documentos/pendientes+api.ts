import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return Response.json({ error: "Missing user ID" }, { status: 400 });
    }

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const result = await sql`
        SELECT form_id, form_tipo, titulo, TO_CHAR(actualizado_en, 'DD/MM/YYYY') AS fecha
        FROM str_progreso
        WHERE user_id = ${userId} AND completo = false
        ORDER BY actualizado_en DESC;
        `;

        return Response.json(result);
    } catch (error) {
        console.error("Error al consultar pendientes:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
