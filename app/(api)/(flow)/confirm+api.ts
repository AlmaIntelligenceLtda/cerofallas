import crypto from "crypto";
import { NextRequest } from "next/server";
import { URLSearchParams } from "url";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = formData.get("token")?.toString();

  if (!token) {
    return new Response("No token received", { status: 400 });
  }

  const apiKey = process.env.FLOW_API_KEY!;
  const secretKey = process.env.FLOW_SECRET_KEY!;

  // 🔠 Firma requerida
  const params = {
    apiKey,
    token,
  };

  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map((k) => `${k}${params[k]}`).join("");
  const signature = crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");

  const fullParams = new URLSearchParams({
    apiKey,
    token,
    s: signature,
  });

  const response = await fetch("https://www.flow.cl/api/payment/getStatus", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: fullParams.toString(),
  });

  const data = await response.json();
  console.log("✅ Estado del pago recibido:", data);

  // 👉 Validás si fue pagado y actualizás la ride
  if (data.status === 1) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ride/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: data.commerceOrder,
        payment_status: "paid",
      }),
    });
  }

  return new Response("OK");
}
