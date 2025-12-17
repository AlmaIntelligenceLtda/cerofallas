import { clerkClient } from '@clerk/clerk-sdk-node';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Crear usuario en base de datos
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id,
        is_driver
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId},
        ${false}
      );
    `;

    // 2. Sincronizar metadata en Clerk
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        isDriver: false,
      },
    });

    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
