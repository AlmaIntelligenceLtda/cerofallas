import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const formId = searchParams.get("formId");

    if (!userId || !formId) {
        return new Response(JSON.stringify({ error: "Faltan parámetros" }), { status: 400 });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
        // Consultar el formulario y las fotos asociadas en la tabla ctv_progreso
        const result = await sql`
            SELECT form_data, photos, id
            FROM ctv_progreso
            WHERE user_id = ${userId}
              AND form_tipo = 'conectividad'
              AND form_id = ${formId}
            LIMIT 1;
        `;

        // Si no se encuentra el registro o no tiene form_data
        if (result.length === 0 || !result[0].form_data) {
            return new Response(JSON.stringify({ form_data: null, photos: null }), { status: 200 });
        }

        // Parsear el form_data y photos
        const parsedForm = typeof result[0].form_data === "string"
            ? JSON.parse(result[0].form_data)
            : result[0].form_data;

        const parsedPhotos = typeof result[0].photos === "string"
            ? JSON.parse(result[0].photos)
            : result[0].photos;

        // Responder con los datos del formulario, fotos y el id del progreso
        return new Response(JSON.stringify({
            form_data: parsedForm,
            photos: parsedPhotos || {},
            id: result[0]?.id || null,
        }), { status: 200 });

    } catch (error) {
        console.error("Error al consultar progreso conectividad:", error);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
}
