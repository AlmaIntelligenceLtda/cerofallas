import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order_id, payment_status } = body;

        if (!order_id || !payment_status) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sql = neon(`${process.env.DATABASE_URL}`);

        const response = await sql`
      UPDATE rides
      SET payment_status = ${payment_status}
      WHERE order_id = ${order_id}
      RETURNING *;
    `;

        if (response.length === 0) {
            return Response.json({ error: "Ride not found" }, { status: 404 });
        }

        return Response.json({ data: response[0] });
    } catch (error) {
        console.error("Error updating payment status:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
