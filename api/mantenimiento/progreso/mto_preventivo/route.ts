import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const { userId, formData, progresoId } = await req.json();

  console.log("📥 Progreso recibido:", { userId, progresoId });
  console.log("📄 Formulario:", formData);

  if (!userId || !formData?.nombreSitio) {
    console.warn("⚠️ Faltan datos obligatorios");
    return Response.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }

  const {
    siteId,
    nombreSitio,
    direccion,
    nombreIc
  } = formData;

  const completo = !!(siteId && nombreSitio && direccion && nombreIc);

  const sql = neon(process.env.DATABASE_URL!);

  console.log("📌 Determinando si se debe insertar o actualizar...");

  try {
    const updated = await sql`
      INSERT INTO mto_progreso (
        user_id,
        form_tipo,
        form_id,
        titulo,
        form_data,
        completo,
        actualizado_en
      )
      VALUES (
        ${userId},
        'mantenimiento',
        -1,
        ${nombreSitio},
        ${JSON.stringify(formData)},
        ${completo},
        NOW()
      )
      ON CONFLICT (user_id, form_tipo, form_id)
      DO UPDATE SET
        titulo = ${nombreSitio},
        form_data = ${JSON.stringify(formData)},
        completo = ${completo},
        actualizado_en = NOW()
      RETURNING id;
    `;

    const progresoIdFinal = updated[0]?.id;
    console.log("✅ Progreso guardado con ID:", progresoIdFinal);

    return Response.json({ success: true, id: progresoIdFinal });
  } catch (error) {
    console.error("❌ Error en INSERT/UPDATE:", error);
    return Response.json({ error: "Error al guardar progreso" }, { status: 500 });
  }
}
