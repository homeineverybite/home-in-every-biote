import Link from "next/link";
import products from "../../data/products";

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin – Product List</h1>
        <Link href="/admin/invoices" className="px-3 py-2 rounded-lg border">Invoice History</Link>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-neutral-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name || p.id}</td>
              <td className="p-2">€{p.price.toFixed(2)}</td>
              <td className="p-2">{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
