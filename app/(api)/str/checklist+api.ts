import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  const body = await req.json();
  const sql = neon(`${process.env.DATABASE_URL}`);

  const {
    userId,
    progresoId,
    codigo,
    nombre,
    direccion,
    nombreProfesional,
    empresaAliada,
    fechaEjecucion,
    marcaRectificador,
    modeloRectificador,
    potenciaTotal,
    modulosInstalados,
    capacidadAmperes,
    recarga5,
    marcaGabinete,
    modeloGabinete,
    limpiezaGabinete,
    anclajeGabinete,
    climatizacion,
    llavesEntregadas,
    marcaBaterias,
    modeloBaterias,
    cantidadBancos,
    capacidadBanco,
    capacidadTotalBanco,
    observaciones,
    checkItems = [],
    voltajes = [],
  } = body;

  if (!userId || !codigo || !nombre || !nombreProfesional) {
    return Response.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const insertResult = await sql`
      INSERT INTO str_checklist (
        user_id, codigo, nombre, direccion, nombre_profesional, empresa_aliada, fecha_ejecucion,
        marca_rectificador, modelo_rectificador, potencia_total, modulos_instalados, capacidad_amperes, recarga_5,
        marca_gabinete, modelo_gabinete, limpieza_gabinete, anclaje_gabinete, climatizacion, llaves_entregadas,
        marca_baterias, modelo_baterias, cantidad_bancos, capacidad_banco, capacidad_total_banco,
        observaciones, check_items, voltajes
      )
      VALUES (
        ${userId}, ${codigo}, ${nombre}, ${direccion}, ${nombreProfesional}, ${empresaAliada}, ${fechaEjecucion},
        ${marcaRectificador}, ${modeloRectificador}, ${potenciaTotal}, ${modulosInstalados}, ${capacidadAmperes}, ${recarga5},
        ${marcaGabinete}, ${modeloGabinete}, ${limpiezaGabinete}, ${anclajeGabinete}, ${climatizacion}, ${llavesEntregadas},
        ${marcaBaterias}, ${modeloBaterias}, ${cantidadBancos}, ${capacidadBanco}, ${capacidadTotalBanco},
        ${observaciones}, ${JSON.stringify(checkItems)}, ${JSON.stringify(voltajes)}
      )
      RETURNING id;
    `;

    const checklistId = insertResult[0]?.id;

    if (progresoId && checklistId) {
      await sql`
        UPDATE str_progreso
        SET form_id = ${checklistId}
        WHERE id = ${progresoId};
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error al insertar checklist:", error);
    return Response.json({ error: "Error al guardar checklist" }, { status: 500 });
  }
}
