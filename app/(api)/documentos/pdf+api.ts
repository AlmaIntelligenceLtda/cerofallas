import { neon } from "@neondatabase/serverless";
import PDFDocument from "pdfkit";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const formTipo = searchParams.get("form_tipo");
    const id = searchParams.get("id");

    if (!formTipo || !id) {
        return Response.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    let result;

    try {
        if (formTipo === "caratula") {
            result = await sql`SELECT * FROM str_caratula WHERE id = ${id}`;
        } else if (formTipo === "checklist") {
            result = await sql`SELECT * FROM str_checklist WHERE id = ${id}`;
        } else {
            return Response.json({ error: "form_tipo inválido" }, { status: 400 });
        }

        const data = result[0];
        if (!data) {
            return Response.json({ error: "Formulario no encontrado" }, { status: 404 });
        }

        // Crear PDF en memoria
        const doc = new PDFDocument();
        const chunks: any[] = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => { });

        doc.fontSize(20).text(`FORMULARIO: ${formTipo.toUpperCase()}`, { underline: true });
        doc.moveDown();

        Object.entries(data).forEach(([key, value]) => {
            doc.fontSize(12).text(`${key}: ${value ?? ""}`);
        });

        doc.end();

        await new Promise((resolve) => doc.on("end", resolve));
        const pdfBuffer = Buffer.concat(chunks);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=${formTipo}_${id}.pdf`,
                "Cache-Control": "no-cache",
                "Content-Length": pdfBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("Error generando PDF:", error);
        return Response.json({ error: "Error al generar PDF" }, { status: 500 });
    }
}
