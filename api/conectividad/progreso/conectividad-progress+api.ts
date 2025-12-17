// DEPRECATED: moved to /api/conectividad/progreso/conectividad-progress/route.ts
export async function GET() {
  return new Response(
    JSON.stringify({
      error: 'Endpoint moved to /api/conectividad/progreso/conectividad-progress/route',
    }),
    { status: 410 }
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({
      error: 'Endpoint moved to /api/conectividad/progreso/conectividad-progress/route',
    }),
    { status: 410 }
  );
}
