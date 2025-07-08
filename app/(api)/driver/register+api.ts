import { neon } from "@neondatabase/serverless";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            licenseFront,
            licenseBack,
            idFront,
            idBack,
            craneType,
            maxLoad,
            craneModel,
            clerkId,
            rut_number
        } = body;

        // Validación de campos
        if (!clerkId || !licenseFront || !licenseBack || !idFront || !idBack || !craneType || !maxLoad || !craneModel) {
            return new Response(JSON.stringify({ error: "Campos incompletos" }), { status: 400 });
        }

        const sql = neon(process.env.DATABASE_URL!);

        // Actualizar el campo `is_driver` en la tabla `users`
        await sql`
      UPDATE users
      SET is_driver = true
      WHERE clerk_id = ${clerkId};
    `;

        // Insertar o actualizar la información del conductor en la tabla `drivers`
        await sql`
      INSERT INTO drivers (
        clerk_id,
        car_seats,
        license_front_url,
        license_back_url,
        cedula_front_url,
        cedula_back_url,
        truck_type,
        max_weight_capacity,
        truck_model,
        rut_number
      ) VALUES (
        ${clerkId},
        ${1},  -- Ajustar cantidad de asientos si es necesario
        ${licenseFront},
        ${licenseBack},
        ${idFront},
        ${idBack},
        ${craneType},
        ${maxLoad},
        ${craneModel},
        ${rut_number}
      )
      ON CONFLICT (clerk_id) DO UPDATE
      SET
        license_front_url = EXCLUDED.license_front_url,
        license_back_url = EXCLUDED.license_back_url,
        cedula_front_url = EXCLUDED.cedula_front_url,
        cedula_back_url = EXCLUDED.cedula_back_url,
        truck_type = EXCLUDED.truck_type,
        max_weight_capacity = EXCLUDED.max_weight_capacity,
        truck_model = EXCLUDED.truck_model,
        rut_number = EXCLUDED.rut_number;
    `;

        await clerkClient.users.updateUser(clerkId, {
            publicMetadata: {
                isDriver: true,
            },
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error al registrar conductor:", error);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
}
