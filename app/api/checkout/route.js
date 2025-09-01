import { NextResponse } from "next/server";
import createMollieClient from "@mollie/api-client";

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export async function POST(req) {
  const body = await req.json();
  const { cart = [], shippingMethod = "pickup", customer = {}, language = "en" } = body;
  const amount = cart.reduce((s, it) => s + it.price * it.qty, 0);

  let shippingCost = 0;
  if (amount <= 50) {
    if (shippingMethod === "postnl" || shippingMethod === "dhl") shippingCost = 5.5;
  }
  const total = amount + shippingCost;

  const payment = await mollie.payments.create({
    amount: { value: total.toFixed(2), currency: "EUR" },
    description: `Home in Every Bite order (${shippingMethod})`,
    redirectUrl: `${process.env.NEXT_PUBLIC_URL}/en/thankyou`,
    webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
    method: ["ideal", "applepay", "creditcard"],
    locale: language === "nl" ? "nl_NL" : language === "af" ? "en_US" : "en_US",
    metadata: { cart, shippingMethod, customer, amount, shippingCost, language },
  });

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
}
