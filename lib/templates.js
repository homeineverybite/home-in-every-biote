import en from "../i18n/locales/en/email.json";
import nl from "../i18n/locales/nl/email.json";
import af from "../i18n/locales/af/email.json";
const dicts = { en, nl, af };

export function orderEmailHtml({ to, orderNumber, cart = [], shippingMethod, customer = {}, amount, shippingCost = 0, total, language = "en" }) {
  const dict = dicts[language] || dicts.en;
  const shippingLabel = shippingMethod === "pickup" ? dict.pickup : (shippingMethod === "postnl" ? "PostNL" : "DHL");
  const itemsHtml = cart.map(it => `<tr><td style="padding:6px 0;">${escapeHtml(it.name || it.id)} × ${it.qty}</td><td style="text-align:right;">€${(it.price * it.qty).toFixed(2)}</td></tr>`).join("");
  const addr = customer?.address;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:16px;">
    <h2>Home in Every Bite</h2>
    <p>${dict.thanks}</p>
    <p><strong>#${orderNumber}</strong></p>
    <h3>${dict.summary}</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tbody>
        ${itemsHtml}
        <tr><td style="padding-top:8px;">${dict.subtotal}</td><td style="text-align:right;padding-top:8px;">€${Number(amount).toFixed(2)}</td></tr>
        <tr><td>${dict.shipping} (${shippingLabel})</td><td style="text-align:right;">€${Number(shippingCost).toFixed(2)}</td></tr>
        <tr><td><strong>${dict.total}</strong></td><td style="text-align:right;"><strong>€${total}</strong></td></tr>
      </tbody>
    </table>
    <p><strong>${dict.ship}:</strong> ${shippingLabel}</p>
    ${addr ? `<p><strong>${dict.address}:</strong><br/>${escapeHtml(addr.line1 || "")}<br/>${escapeHtml(addr.postcode || "")} ${escapeHtml(addr.city || "")}</p>` : ""}
    ${customer?.note ? `<p><strong>${dict.note}:</strong><br/>${escapeHtml(customer.note)}</p>` : ""}
  </div>`;
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}
