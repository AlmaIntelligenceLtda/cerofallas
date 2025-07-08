import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
    const { userId, siteName, formData } = await req.json();

    if (!userId || !siteName) {
        return Response.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const {
        siteId,
        direccion,
        nombreIc,
        latitudGps,
        longitudGps,
        celularIc,
    } = formData;

    const completo =
        !!(siteId && nombreIc && direccion && latitudGps && longitudGps && celularIc);

    const sql = neon(`${process.env.DATABASE_URL}`);

    await sql`
        INSERT INTO str_progreso (
            user_id, form_tipo, form_id, titulo, form_data, completo, actualizado_en
        )
        VALUES (
            ${userId}, 'caratula', -1, ${siteName}, ${JSON.stringify(formData)}, ${completo}, NOW()
        )
        ON CONFLICT (user_id, form_tipo, form_id)
        DO UPDATE SET
            titulo = ${siteName},
            form_data = ${JSON.stringify(formData)},
            completo = ${completo},
            actualizado_en = NOW();
    `;

    return Response.json({ success: true });
}
