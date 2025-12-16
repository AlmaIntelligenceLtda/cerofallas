import { neon } from "@neondatabase/serverless";
import axios from "axios";

const PHOTO_SERVER = process.env.PHOTO_SERVER || "http://165.227.14.82";

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = formData.get("user_id")?.toString();
  const progresoId = formData.get("progreso_id")?.toString();
  const formDataRaw = formData.get("formData")?.toString();

  console.log("🧾 user_id:", userId);
  console.log("🧾 progreso_id:", progresoId);

  if (!userId || !formDataRaw) {
    return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), { status: 400 });
  }

  const parsedFormData = JSON.parse(formDataRaw);

  const fotos = parsedFormData.fotos || {};

  const folderName = `ctv_conectividad_${Date.now()}`;
  const fotosFinal: Record<string, { campo: string; uri: string }[]> = {};

  console.log("📸 Fotos recibidas (parsedFormData.fotos):", fotos);
  console.log("🔑 Claves de fotos:", Object.keys(fotos));

  // Log completo del formData
  console.log("📥 Entradas formData:");
  for (const entry of formData.entries()) {
    const value = entry[1];
    const isFile = typeof value === "object" && "name" in value;
    console.log(`   • ${entry[0]}: ${isFile ? `[File] ${value.name}` : value}`);
  }

  const keys = Object.keys(fotos);

  for (let i = 0; i < keys.length; i++) {
    const campo = keys[i];
    const fotosArray = fotos[campo];
    const campoSanitizado = campo.replace(/\s+/g, "_").toLowerCase();

    for (let j = 0; j < fotosArray.length; j++) {
      const fieldName = `foto_${campoSanitizado}_${j}`;
      const file = formData.get(fieldName) as File;
      console.log(`📂 Procesando ${fieldName}... existe: ${!!file}`);

      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadForm = new FormData();

        uploadForm.append("folderName", folderName);
        uploadForm.append(
          "imagen",
          new Blob([buffer], { type: file.type }),
          file.name || `foto_${campoSanitizado}_${j}.jpg`
        );

        try {
          const resp = await axios.post(`${PHOTO_SERVER}/fotos/upload.php`, uploadForm, {
            headers: typeof (uploadForm as any).getHeaders === "function"
              ? (uploadForm as any).getHeaders()
              : {},
            maxBodyLength: Infinity,
          });

          const data = resp.data;
          const url = typeof data === "string" ? data : data?.url;

          console.log(`✅ URL subida [${fieldName}]:`, url);

          if (url?.startsWith("http")) {
            if (!fotosFinal[campoSanitizado]) fotosFinal[campoSanitizado] = [];
            fotosFinal[campoSanitizado].push({ campo: campoSanitizado, uri: url });
          } else {
            console.warn(`⚠️ Respuesta inesperada al subir ${fieldName}:`, data);
          }
        } catch (err) {
          console.error(`❌ Error al subir foto ${fieldName}:`, err);
        }
      } else {
        console.warn(`⚠️ Archivo no encontrado o inválido: ${fieldName}`);
      }
    }
  }

  console.log("📦 fotosFinal listo para insertar:", fotosFinal);

  // Evaluar completitud
  const camposLlenos = Object.entries(parsedFormData).filter(
    ([k, v]) => k !== "fotos" && k !== "resumenMedicionesAntes" && k !== "resumenMedicionesDespues" && v && v !== ""
  );
  const completo = camposLlenos.length >= 10 && Object.keys(fotosFinal).length >= 1;
  console.log("📋 Campos llenos:", camposLlenos.length, "| Fotos con URLs:", Object.keys(fotosFinal).length);
  console.log("✅ Formulario completo:", completo);

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const result = await sql`
      INSERT INTO ctv_pcctdayf(
        user_id,
        site_id,
        site_name,
        direccion,
        comuna,
        region,
        tipo_sitio,
        estructura,
        altura,
        latitud_gps,
        longitud_gps,
        latitud_porton,
        longitud_porton,
        nombre_ic,
        celular_ic,
        operadora,
        propietario_estructura,
        codigo_dueno_estructura,
        requiere4x4,
        animales,
        andamios,
        grua,
        colocalizado,
        carro_canasta,
        apertura_radomo,
        observaciones,
        resumen_mediciones_antes,
        resumen_mediciones_despues,
        fotos,
        completo
      ) VALUES (
        ${userId},
        ${parsedFormData.siteId},
        ${parsedFormData.siteName},
        ${parsedFormData.direccion},
        ${parsedFormData.comuna},
        ${parsedFormData.region},
        ${parsedFormData.tipoSitio},
        ${parsedFormData.estructura},
        ${parsedFormData.altura},
        ${parsedFormData.latitudGps},
        ${parsedFormData.longitudGps},
        ${parsedFormData.latitudPorton},
        ${parsedFormData.longitudPorton},
        ${parsedFormData.nombreIc},
        ${parsedFormData.celularIc},
        ${parsedFormData.operadora},
        ${parsedFormData.propietario_estructura},
        ${parsedFormData.codigo_dueno_estructura},
        ${parsedFormData.requiere4x4},
        ${parsedFormData.animales},
        ${parsedFormData.andamios},
        ${parsedFormData.grua},
        ${parsedFormData.colocalizado},
        ${parsedFormData.carroCanasta},
        ${parsedFormData.aperturaRadomo},
        ${parsedFormData.observaciones},
        ${JSON.stringify(parsedFormData.resumenMedicionesAntes || {})},
        ${JSON.stringify(parsedFormData.resumenMedicionesDespues || {})},
        ${JSON.stringify(fotosFinal)},
        ${completo}
      ) RETURNING id;
    `;

    const nuevoFormId = result[0]?.id;
    console.log("🆔 Formulario guardado con ID:", nuevoFormId);

    if (progresoId && nuevoFormId) {
      await sql`
        UPDATE str_progreso
        SET form_id = ${nuevoFormId}, completo = ${completo}
        WHERE id = ${progresoId};
      `;
      console.log("🔁 Progreso actualizado:", progresoId);
    }

    return new Response(JSON.stringify({ success: true, id: nuevoFormId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error al guardar conectividad:", err);
    return new Response(JSON.stringify({ error: "Error al guardar conectividad" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
