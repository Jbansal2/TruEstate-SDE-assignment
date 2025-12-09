import React from "react";

export default function Pagination({ meta, onPageChange }) {
  const { page, total_pages } = meta;

  if (total_pages <= 1) return null;
  const windowSize = 5;

  let start = Math.max(1, page - 2);
  let end = start + windowSize - 1;

  if (end > total_pages) {
    end = total_pages;
    start = Math.max(1, end - windowSize + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`px-4 py-1 rounded border cursor-pointer text-sm
          ${page <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
      >
        Prev
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-1 rounded cursor-pointer text-sm
              ${page === p 
                ? "bg-black text-white shadow" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= total_pages}
        className={`px-4 py-1 rounded border  cursor-pointer text-sm
          ${page >= total_pages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
      >
        Next
      </button>

    </div>
  );
}
