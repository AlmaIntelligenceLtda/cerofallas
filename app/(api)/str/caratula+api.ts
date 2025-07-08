import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    userId,
    progresoId,
    siteId,
    siteName,
    direccion,
    comuna,
    region,
    estructura,
    tipoSitio,
    altura,
    latitudGps,
    longitudGps,
    latitudPorton,
    longitudPorton,
    nombreIc,
    celularIc,
    observaciones,
  } = body;

  if (!userId || !siteId || !siteName || !nombreIc) {
    return Response.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    // Insertar carátula oficial y obtener ID generado
    const result = await sql`
      INSERT INTO str_caratula (
        user_id, site_id, site_name, direccion, comuna, region,
        estructura, tipo_sitio, altura,
        latitud_gps, longitud_gps, latitud_porton, longitud_porton,
        nombre_ic, celular_ic, observaciones
      )
      VALUES (
        ${userId}, ${siteId}, ${siteName}, ${direccion}, ${comuna}, ${region},
        ${estructura}, ${tipoSitio}, ${altura},
        ${latitudGps}, ${longitudGps}, ${latitudPorton}, ${longitudPorton},
        ${nombreIc}, ${celularIc}, ${observaciones}
      )
      RETURNING id;
    `;

    const nuevoFormId = result[0]?.id;

    // Si existe progresoId, actualiza form_id en str_progreso
    if (progresoId && nuevoFormId) {
      await sql`
        UPDATE str_progreso
        SET form_id = ${nuevoFormId}
        WHERE id = ${progresoId};
      `;
    }

    return Response.json({ success: true, id: nuevoFormId });
  } catch (error) {
    console.error("Error al insertar carátula:", error);
    return Response.json({ error: "Error al guardar carátula" }, { status: 500 });
  }
}
