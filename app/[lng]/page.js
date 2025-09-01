"use client";
import Link from "next/link";
import { useEffect } from "react";
import { ensureI18n } from "../../i18n/client";
import { useTranslation } from "react-i18next";

export default function Home({ params: { lng } }) {
  useEffect(() => { ensureI18n(lng); }, [lng]);
  const { t } = useTranslation("common");
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold">{t("heroTitle")}</h1>
        <p className="text-neutral-600 mt-2">{t("heroSubtitle")}</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link href={`/${lng}/shop`} className="px-5 py-3 rounded-xl bg-yellow-500 text-white font-medium">{t("shopNow")}</Link>
          <Link href={`/${lng}/catering`} className="px-5 py-3 rounded-xl border border-neutral-300">{t("cateringOrders")}</Link>
        </div>
      </header>
    </main>
  );
}
