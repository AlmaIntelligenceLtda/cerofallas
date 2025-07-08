import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { latitude, longitude, truckType } = body;

        if (!latitude || !longitude || !truckType) {
            return new Response(JSON.stringify({ error: "Faltan coordenadas o tipo de grúa" }), {
                status: 400,
            });
        }

        const sql = neon(process.env.DATABASE_URL!);

        const result = await sql`
      SELECT *
      FROM drivers
      WHERE 
        current_latitude IS NOT NULL 
        AND current_longitude IS NOT NULL
        AND LOWER(TRIM(truck_type)) = LOWER(TRIM(${truckType}))
      ORDER BY point(current_latitude::float8, current_longitude::float8) <-> point(${latitude}::float8, ${longitude}::float8)
      LIMIT 5;
    `;

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error en nearby:", error);
        return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
        });
    }
}
