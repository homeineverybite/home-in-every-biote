"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ensureI18n } from "../../../i18n/client";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { lng } = useParams();
  const { t } = useTranslation("checkout");
  useEffect(() => { ensureI18n(lng); }, [lng]);

  const [cart, setCart] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("pickup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState({ line1: "", city: "", postcode: "" });

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const shippingCost = useMemo(() => {
    if (subtotal > 50 || subtotal === 0) return 0;
    if (shippingMethod === "pickup") return 0;
    if (shippingMethod === "postnl") return 5.5;
    if (shippingMethod === "dhl") return 5.5;
    return 0;
  }, [shippingMethod, subtotal]);
  const total = subtotal + shippingCost;

  async function handleCheckout() {
    const customer = { email, name, note, address: shippingMethod === "pickup" ? null : address };
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, shippingMethod, customer, language: lng }),
    });
    const data = await res.json();
    if (data?.checkoutUrl) window.location.href = data.checkoutUrl;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {cart.length === 0 && <p>{t("empty")}</p>}
      <ul className="divide-y">
        {cart.map(it => (
          <li key={it.id} className="py-3 flex justify-between">
            <span>{it.name || it.id} × {it.qty}</span>
            <span>€{(it.price * it.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-semibold">{t("subtotal")}: €{subtotal.toFixed(2)}</p>

      <div className="mt-4 space-y-2">
        <label className="flex items-center gap-2">
          <input type="radio" name="shipping" value="pickup" checked={shippingMethod === "pickup"} onChange={() => setShippingMethod("pickup")} />
          {t("pickup")}
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="shipping" value="postnl" checked={shippingMethod === "postnl"} onChange={() => setShippingMethod("postnl")} />
          {t("postnl")}
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="shipping" value="dhl" checked={shippingMethod === "dhl"} onChange={() => setShippingMethod("dhl")} />
          {t("dhl")}
        </label>
      </div>

      <div className="mt-6 grid gap-3">
        <input className="w-full px-3 py-2 rounded-xl border" placeholder={t("email")} value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full px-3 py-2 rounded-xl border" placeholder={t("name")} value={name} onChange={e => setName(e.target.value)} />
        {shippingMethod !== "pickup" && (<>
          <input className="w-full px-3 py-2 rounded-xl border" placeholder={t("address")} value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full px-3 py-2 rounded-xl border" placeholder={t("city")} value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
            <input className="w-full px-3 py-2 rounded-xl border" placeholder={t("postcode")} value={address.postcode} onChange={e => setAddress(a => ({ ...a, postcode: e.target.value }))} />
          </div>
        </>)}
        <textarea className="w-full px-3 py-2 rounded-xl border h-24" placeholder={t("note")} value={note} onChange={e => setNote(e.target.value)} />
      </div>

      <p className="mt-4 font-semibold">{t("shipping")}: {shippingCost === 0 ? "Free" : f"€{shippingCost:.2f}"}</p>
      <p className="mt-2 font-bold text-lg">{t("total")}: €{total.toFixed(2)}</p>

      <button disabled={cart.length === 0 || !email} onClick={handleCheckout} className="mt-4 w-full px-5 py-3 rounded-xl bg-neutral-900 text-white disabled:bg-neutral-300">
        {t("checkout")}
      </button>
      <Link href="/shop" className="block mt-4 underline">{t("continue")}</Link>
    </div>
  );
}
