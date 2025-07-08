import crypto from "crypto";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { URLSearchParams } from "url";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, amount } = body;

  const apiKey = process.env.FLOW_API_KEY!;
  const secretKey = process.env.FLOW_SECRET_KEY!;
  const orderId = uuidv4();
  const urlConfirmation = `${process.env.EXPO_PUBLIC_SERVER_URL}/api/flow/confirm`;
  const urlReturn = "myapp://book-ride";

  // ⚠️ Validaciones básicas
  if (!name || !email || !amount) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // 🧮 Parámetros requeridos
  const params: Record<string, string> = {
    apiKey,
    commerceOrder: orderId,
    subject: "Pago de servicio de grúa",
    currency: "CLP",
    amount: parseInt(amount).toString(),
    email,
    urlConfirmation,
    urlReturn,
  };

  // 🔠 Ordenar alfabéticamente
  const orderedKeys = Object.keys(params).sort();
  const stringToSign = orderedKeys.map((key) => `${key}${params[key]}`).join("");

  // 🔐 Firmar con HMAC-SHA256 usando la secretKey
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign)
    .digest("hex");

  // Agregar firma
  params["s"] = signature;

  // 🌐 Enviar como x-www-form-urlencoded
  const formData = new URLSearchParams(params);

  const response = await fetch("https://www.flow.cl/api/payment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await response.json();
  console.log("Flow response:", data);

  if (data.token && data.url) {
    return new Response(
      JSON.stringify({
        url: `${data.url}?token=${data.token}`,
        orderNumber: orderId,
      }),
    );
  }

  return new Response(JSON.stringify({ error: data.message || "Flow error" }), {
    status: 500,
  });
}
