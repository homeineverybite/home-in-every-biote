import PDFDocument from "pdfkit";

export async function generateInvoicePdf({ orderNumber, cart = [], shippingMethod, customer = {}, amount, shippingCost = 0, total, language = "en" }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    const dicts = {
      en: { invoice: "Invoice", billTo: "Bill to", items: "Items", subtotal: "Subtotal", shipping: "Shipping", total: "Total", method: "Shipping method" },
      nl: { invoice: "Factuur", billTo: "Factuuradres", items: "Artikelen", subtotal: "Subtotaal", shipping: "Verzending", total: "Totaal", method: "Verzendmethode" },
      af: { invoice: "Faktuur", billTo: "Rekening aan", items: "Items", subtotal: "Subtotaal", shipping: "Versending", total: "Totaal", method: "Versendingsmetode" },
    };
    const dict = dicts[language] || dicts.en;

    doc.fontSize(20).text(`Home in Every Bite`, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`${dict.invoice}: ${orderNumber}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(12).text(`${dict.billTo}:`);
    doc.text(customer?.name || "");
    if (customer?.address) {
      doc.text(customer.address.line1 || "");
      doc.text(`${customer.address.postcode || ""} ${customer.address.city || ""}`);
    }
    doc.text(customer?.email || "");
    doc.moveDown();

    doc.fontSize(12).text(dict.items, { underline: true });
    cart.forEach(it => {
      doc.text(`${it.name || it.id} × ${it.qty} — €${(it.price * it.qty).toFixed(2)}`);
    });
    doc.moveDown();

    doc.text(`${dict.subtotal}: €${amount.toFixed(2)}`);
    doc.text(`${dict.shipping} (${dict.method}: ${shippingMethod}): €${shippingCost.toFixed(2)}`);
    doc.fontSize(14).text(`${dict.total}: €${total}`, { align: "right" });

    doc.moveDown();
    doc.fontSize(10).text("KVK 12345678 • BTW NL001234567B01", { align: "center" });
    doc.text("Allergen info available on request.", { align: "center" });

    doc.end();
  });
}
