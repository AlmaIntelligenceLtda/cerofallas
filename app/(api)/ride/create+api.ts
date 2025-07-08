import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
      order_id, // ahora opcional
    } = body;

    // Validación sin order_id obligatorio
    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      INSERT INTO rides ( 
        origin_address, destination_address, origin_latitude, origin_longitude,
        destination_latitude, destination_longitude, ride_time, fare_price,
        payment_status, driver_id, user_id, order_id
      ) VALUES (
        ${origin_address}, ${destination_address}, ${origin_latitude}, ${origin_longitude},
        ${destination_latitude}, ${destination_longitude}, ${ride_time}, ${fare_price},
        ${payment_status}, ${driver_id}, ${user_id}, ${order_id ?? null}
      ) RETURNING *;
    `;

    const userResponse = await sql`
      SELECT name
      FROM users
      WHERE clerk_id = ${user_id}
    `;

    // Combinamos la respuesta del viaje con el nombre del usuario
    const rideWithUser = {
      ...response[0], // Información del viaje
      userName: userResponse[0]?.name || "Unknown", // Si no se encuentra el nombre, ponemos "Unknown"
    };

    return Response.json({ data: rideWithUser }, { status: 201 });
  } catch (error) {
    console.error("Error inserting ride:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
