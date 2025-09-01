"use client";
import { useEffect, useState } from "react";

export default function AdminInvoicesPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { fetch("/api/invoices").then(r => r.json()).then(d => setRows(d.invoices || [])); }, []);

  function toCSV() {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const escape = (v) => `"${String(v ?? "").replace(/"/g,'""')}"`;
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
    return csv;
  }
  function downloadCSV() {
    const blob = new Blob([toCSV()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-history-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice History</h1>
        <button onClick={downloadCSV} className="px-3 py-2 rounded-lg border">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-neutral-100 text-left">
              <th className="p-2">Invoice #</th>
              <th className="p-2">Date</th>
              <th className="p-2">Payment ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Email</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Shipping</th>
              <th className="p-2">Total</th>
              <th className="p-2">Method</th>
              <th className="p-2">Lang</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.invoiceNumber}</td>
                <td className="p-2">{new Date(r.date).toLocaleString()}</td>
                <td className="p-2">{r.paymentId}</td>
                <td className="p-2">{r.customer?.name || ""}</td>
                <td className="p-2">{r.customer?.email || ""}</td>
                <td className="p-2">€{Number(r.amount).toFixed(2)}</td>
                <td className="p-2">€{Number(r.shippingCost).toFixed(2)}</td>
                <td className="p-2">€{Number(r.total).toFixed(2)}</td>
                <td className="p-2">{r.shippingMethod}</td>
                <td className="p-2">{r.language}</td>
              </tr>
            ))}
            {!rows.length && (<tr><td className="p-4 text-neutral-500" colSpan={10}>No invoices yet.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
