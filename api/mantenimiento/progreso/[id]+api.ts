// DEPRECATED: moved to /api/mantenimiento/progreso/[id]/route.ts
export async function GET() {
  return new Response(
    JSON.stringify({ error: 'Endpoint moved to /api/mantenimiento/progreso/[id]/route' }),
    { status: 410 }
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Endpoint moved to /api/mantenimiento/progreso/[id]/route' }),
    { status: 410 }
  );
}
