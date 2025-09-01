import nodemailer from "nodemailer";
import { orderEmailHtml } from "./templates";
import { generateInvoicePdf } from "./pdf";
import fs from "fs";
import path from "path";

export async function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendOrderEmails({ paymentId, cart, shippingMethod, customer, amount, shippingCost, language = "en" }) {
  const transport = await getTransport();
  const total = (amount + (shippingCost || 0)).toFixed(2);

  const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const invoiceNumber = `INV-${dateStr}-${paymentId}`;

  const htmlCustomer = orderEmailHtml({ to: "customer", orderNumber: invoiceNumber, cart, shippingMethod, customer, amount, shippingCost, total, language });
  const htmlAdmin = orderEmailHtml({ to: "admin", orderNumber: invoiceNumber, cart, shippingMethod, customer, amount, shippingCost, total, language });

  const pdfBuffer = await generateInvoicePdf({ orderNumber: invoiceNumber, cart, shippingMethod, customer, amount, shippingCost, total, language });

  // Log invoice
  try {
    const logPath = path.join(process.cwd(), "data", "invoices.json");
    let existing = [];
    if (fs.existsSync(logPath)) existing = JSON.parse(fs.readFileSync(logPath, "utf-8"));
    existing.push({
      invoiceNumber,
      date: new Date().toISOString(),
      paymentId,
      customer: { email: customer?.email, name: customer?.name },
      amount,
      shippingCost,
      total,
      shippingMethod,
      language
    });
    fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
  } catch (e) {
    console.error("Failed to log invoice", e);
  }

  const subjectMap = {
    en: `Order confirmation ${invoiceNumber}`,
    nl: `Orderbevestiging ${invoiceNumber}`,
    af: `Bestellingsbevestiging ${invoiceNumber}`,
  };

  if (customer?.email) {
    await transport.sendMail({
      from: process.env.FROM_EMAIL,
      to: customer.email,
      subject: `${subjectMap[language] || subjectMap.en} | Home in Every Bite`,
      html: htmlCustomer,
      attachments: [{ filename: `${invoiceNumber}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
    });
  }

  if (process.env.ORDER_NOTIFY_EMAIL) {
    await transport.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.ORDER_NOTIFY_EMAIL,
      subject: `New order ${invoiceNumber}`,
      html: htmlAdmin,
      attachments: [{ filename: `${invoiceNumber}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
    });
  }
}
