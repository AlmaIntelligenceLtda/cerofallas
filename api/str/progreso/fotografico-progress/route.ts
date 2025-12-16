import { neon } from "@neondatabase/serverless";
import axios from "axios";

const PHOTO_SERVER = process.env.PHOTO_SERVER || "http://165.227.14.82";

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = formData.get("userId")?.toString();
  const formDataRaw = formData.get("formData")?.toString();
  const formId = formData.get("formId")?.toString() || "-1";

  if (!userId || !formDataRaw) {
    return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsedFormData = JSON.parse(formDataRaw);

  // 🧼 Eliminar campo "fotos" del formData antes de guardar
  if (parsedFormData?.fotos) {
    delete parsedFormData.fotos;
  }

  const folderName = `fotografico_draft_${Date.now()}`;
  const newPhotos: Record<string, string> = {};

  console.log("📩 FORM DATA ENTRANTE:");
  for (const entry of formData.entries()) {
    const value = entry[1];
    const isFile = typeof value === "object" && "name" in value;
    console.log(`   • ${entry[0]}: ${isFile ? `[File] ${value.name}` : value}`);
  }

  // 🖼️ Procesar fotos nuevas
  for (const [key, value] of formData.entries()) {
    if (typeof value === "object" && "arrayBuffer" in value) {
      const file = value as File;
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadForm = new FormData();
      uploadForm.append("folderName", folderName);
      uploadForm.append("imagen", new Blob([buffer], { type: file.type }), file.name);

      try {

        const uploadResp = await axios.post(
          `${PHOTO_SERVER}/fotos/upload.php`,
          uploadForm,
          {
            maxBodyLength: Infinity,
          }
        );

        const url = uploadResp.data;
        console.log(`✅ URL recibida:`, url);
        if (typeof url === "string" && url.startsWith("http")) {
          newPhotos[key] = url;
        } else {
          console.warn(`⚠️ Respuesta inesperada del servidor:`, url);
        }
      } catch (error) {
        console.error(`❌ Error subiendo "${key}":`, error);
      }
    }
  }

  // 🔁 Recuperar fotos anteriores (aunque estén como string)
  let prevPhotos: Record<string, string> = {};
  try {
    const previous = await neon(process.env.DATABASE_URL!)`
      SELECT photos FROM str_progreso
      WHERE user_id = ${userId} AND form_tipo = 'fotografico' AND form_id = -1;
    `;
    const raw = previous[0]?.photos;
    if (typeof raw === "string") {
      prevPhotos = JSON.parse(raw);
    } else if (typeof raw === "object" && raw !== null) {
      prevPhotos = raw;
    }
    console.log("🗂️ Fotos previas recuperadas:", prevPhotos);
  } catch (err) {
    console.error("⚠️ Error consultando fotos anteriores:", err);
  }

  // ✅ Combinar fotos previas + nuevas
  const finalPhotos = { ...prevPhotos, ...newPhotos };

  // 🧠 Determinar completitud
  const observaciones = parsedFormData?.observaciones?.trim();
  const respuestas = Object.keys(parsedFormData).filter(k => parsedFormData[k] && k !== "observaciones");
  const fotosAgregadas = Object.keys(finalPhotos).filter(k => finalPhotos[k]);
  const completo = !!observaciones && respuestas.length > 5 && fotosAgregadas.length > 5;

  console.log("📦 Guardando con los siguientes datos:");
  console.log("   • user_id:", userId);
  console.log("   • form_id: -1");
  console.log("   • completitud:", completo);
  console.log("   • respuestas:", respuestas.length);
  console.log("   • fotos nuevas:", Object.keys(newPhotos).length);
  console.log("   • finalPhotos:", finalPhotos);

  try {
    const result = await neon(process.env.DATABASE_URL!)`
      INSERT INTO str_progreso (
        user_id, form_tipo, form_id, titulo, form_data, photos, completo, actualizado_en
      )
      VALUES (
        ${userId}, 'fotografico', -1, 'Checklist ECE/BB', ${parsedFormData}, ${finalPhotos}, ${completo}, NOW()
      )
      ON CONFLICT (user_id, form_tipo, form_id)
      DO UPDATE SET
        form_data = EXCLUDED.form_data,
        photos = EXCLUDED.photos,
        completo = EXCLUDED.completo,
        actualizado_en = NOW()
      RETURNING id, form_id;
    `;

    console.log("✅ Guardado exitoso. ID:", result[0]?.id, "FORM_ID:", result[0]?.form_id);

    return new Response(
      JSON.stringify({
        success: true,
        id: result[0]?.id,
        form_id: result[0]?.form_id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error al guardar en str_progreso:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
