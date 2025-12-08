import React from "react";
import { formatDate } from "../utils/format";

export default function Table({ data }) {
  return (
    <div className=" rounded-md shadow-sm overflow-hidden mt-4 p-2">
      <div className="table-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200">
            <tr >
              <th className="text-left font-light px-4 py-3">Transaction ID</th>
              <th className="text-left font-light px-4 py-3">Date</th>
              <th className="text-left font-light px-4 py-3">Customer ID</th>
              <th className="text-left font-light px-4 py-3">Customer name</th>
              <th className="text-left font-light px-4 py-3">Phone</th>
              <th className="text-left font-light px-4 py-3">Gender</th>
              <th className="text-left font-light px-4 py-3">Age</th>
              <th className="text-left font-light px-4 py-3">Product Category</th>
              <th className="text-left font-light px-4 py-3">Qty</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}

            {data.map(item => (
              <tr key={item.sale_id} className="border-t last:border-b">
                <td className="px-4 py-3">{item.sale_id}</td>
                <td className="px-4 py-3">{formatDate(item.date)}</td>
                <td className="px-4 py-3">{item.customer?.customer_id || "-"}</td>
                <td className="px-4 py-3">{item.customer?.name || "-"}</td>
                <td className="px-4 py-3">{item.customer?.phone || "-"}</td>
                <td className="px-4 py-3">{item.customer?.gender || "-"}</td>
                <td className="px-4 py-3">{item.customer?.age ?? "-"}</td>
                <td className="px-4 py-3">{item.product?.category || "-"}</td>
                <td className="px-4 py-3">{String(item.quantity).padStart(2, "0")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
