import { NextResponse } from "next/server";
import createMollieClient from "@mollie/api-client";
import { sendOrderEmails } from "../../../lib/mailer";

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export async function POST(req) {
  const form = await req.formData();
  const id = form.get("id");
  if (!id) return NextResponse.json({ ok: true });
  const payment = await mollie.payments.get(id);
  if (payment.status === "paid") {
    const meta = payment.metadata || {};
    try {
      await sendOrderEmails({
        paymentId: payment.id,
        ...meta,
      });
    } catch (e) {
      console.error("Email send failed", e);
    }
  }
  return NextResponse.json({ ok: true });
}
