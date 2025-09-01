"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import products from "../../../data/products";
import { ensureI18n } from "../../../i18n/client";
import { useTranslation } from "react-i18next";

export default function Shop({ params: { lng } }) {
  useEffect(() => { ensureI18n(lng); }, [lng]);
  const { t: tProducts } = useTranslation("products");
  const { t: tCategories } = useTranslation("categories");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const localized = useMemo(() => products.map(p => ({
    ...p,
    name: tProducts(`${p.id}.name`),
    description: tProducts(`${p.id}.description`),
  })), [tProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localized.filter(p => (category === "all" || p.category === category) && (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
  }, [localized, category, query]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          {Object.keys({ all: true, cakes: true, rusks: true, breads: true }).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm border ${category === cat ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-neutral-200"}`}>
              {tCategories(cat)}
            </button>
          ))}
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products…" className="w-full md:w-80 px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="rounded-xl bg-white border p-4">
            <img src={p.image} alt={p.name} className="rounded-lg mb-2" />
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p className="text-sm text-neutral-600">{p.description}</p>
            <p className="font-bold mt-2">€{p.price.toFixed(2)}</p>
            <Link href={`/${lng}/shop/${p.id}`} className="mt-3 inline-block px-3 py-2 rounded-lg bg-neutral-900 text-white">View</Link>
          </div>
        ))}
        {filtered.length === 0 && (<p className="text-neutral-600">No products found.</p>)}
      </div>
    </main>
  );
}
