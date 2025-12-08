import React from "react";

export default function Pagination({ meta, onPageChange }) {
  const pages = Array.from({ length: Math.max(1, meta.total_pages) }, (_, i) => i + 1);
  if (pages.length === 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, meta.page - 1))}
        className="px-3 py-1 border rounded-md bg-white"
        disabled={meta.page <= 1}
      >
        Prev
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md ${meta.page === p ? "bg-indigo-600 text-white" : "bg-white border"}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(meta.total_pages, meta.page + 1))}
        className="px-3 py-1 border rounded-md bg-white"
        disabled={meta.page >= meta.total_pages}
      >
        Next
      </button>
    </div>
  );
}
