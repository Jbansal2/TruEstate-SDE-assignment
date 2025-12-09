import React, { useState } from "react";
import { formatDate } from "../utils/format";
import { FiCopy } from "react-icons/fi";

export default function Table({ data }) {
  const [copied, setCopied] = useState(null);

  const copyPhone = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(phone);

    setTimeout(() => setCopied(null), 1000);
  };

  return (
    <div className="rounded-md shadow-sm overflow-hidden mt-4 p-2">
      <div className="table-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
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

            {data.map((item) => {
              const phone = item.customer?.phone || "-";

              return (
                <tr key={item.sale_id} className="border-t last:border-b border-gray-200">
                  <td className="px-4 py-2">{item.sale_id}</td>
                  <td className="px-4 py-2">{formatDate(item.date)}</td>
                  <td className="px-4 py-2">{item.customer?.customer_id || "-"}</td>
                  <td className="px-4 py-2">{item.customer?.name || "-"}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span>+91 {phone}</span>

                    {phone !== "-" && (
                      <FiCopy
                        className="cursor-pointer text-gray-500 hover:text-black"
                        onClick={() => copyPhone(phone)}
                      />
                    )}

                    {copied === phone && (
                      <span className="text-xs text-black">Copied!</span>
                    )}
                  </td>

                  <td className="px-4 py-2">{item.customer?.gender || "-"}</td>
                  <td className="px-4 py-2">{item.customer?.age ?? "-"}</td>
                  <td className="px-4 py-2">{item.product?.category || "-"}</td>
                  <td className="px-4 py-2">{String(item.quantity).padStart(2, "0")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
