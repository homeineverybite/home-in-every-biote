"use client";
import { useEffect } from "react";
import { ensureI18n } from "../../../i18n/client";
import { useTranslation } from "react-i18next";

export default function ThankYou({ params: { lng } }) {
  useEffect(() => { ensureI18n(lng); }, [lng]);
  const { t } = useTranslation("thankyou");
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">{t("message")}</p>
    </div>
  );
}
