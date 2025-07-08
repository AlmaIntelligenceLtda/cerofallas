import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { latitude, longitude, clerkId } = body;

        if (!clerkId || !latitude || !longitude) {
            return new Response(JSON.stringify({ error: "Datos incompletos" }), { status: 400 });
        }

        const sql = neon(process.env.DATABASE_URL!);

        await sql`
      UPDATE drivers
      SET
        current_latitude = ${latitude},
        current_longitude = ${longitude},
        updated_at = NOW()
      WHERE clerk_id = ${clerkId};
    `;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error al actualizar ubicación:", error);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
}
