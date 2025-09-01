"use client";
import { useEffect } from "react";
import products from "../../../../data/products";
import { ensureI18n } from "../../../../i18n/client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function ProductPage({ params: { lng, id } }) {
  useEffect(() => { ensureI18n(lng); }, [lng]);
  const { t } = useTranslation("products");
  const product = products.find(p => p.id === id);
  if (!product) return <div className="p-10">Not found</div>;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <img src={product.image} alt={t(`${id}.name`)} className="rounded-lg mb-4" />
      <h1 className="text-3xl font-bold">{t(`${id}.name`)}</h1>
      <p className="mt-2 text-neutral-600">{t(`${id}.description`)}</p>
      <p className="mt-3 font-semibold text-xl">€{product.price.toFixed(2)}</p>
      <Link href={`/${lng}/cart`} className="block mt-4 underline">Go to Cart</Link>
    </div>
  );
}
