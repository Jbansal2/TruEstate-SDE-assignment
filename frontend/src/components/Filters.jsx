import React from "react";
import { CiSearch } from "react-icons/ci";
import StatsBoxes from "./StatsBoxes";


export default function Filters({ filters, setFilters }) {
  const update = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));

  return (
    <div className="flex flex-wrap   justify-between  rounded">
      <div className="flex items-center gap-4 mb-5 w-full justify-between bg-white px-4 py-3 rounded shadow">
        <div>
          <h1 className="font-bold text-2xl">Sales Management System</h1>
        </div>
        <div className="flex items-center gap-2 border px-3 py-1 rounded bg-gray-200">
          <CiSearch />
          <input
            type="text"
            placeholder="Name, Phone no."
            value={filters.q}
            onChange={e => update("q", e.target.value)}
            className="w-64 px-3 py-1 border rounded outline-none border-none text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center p-2 gap-2">
        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.regions || ""}
          onChange={e => update("regions", e.target.value)}
        >
          <option value="">Customer Region</option>
          <option value="Noida">Noida</option>
          <option value="Greater Noida">Greater Noida</option>
          <option value="Gurugram">Gurugram</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.genders || ""}
          onChange={e => update("genders", e.target.value)}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.categories || ""}
          onChange={e => update("categories", e.target.value)}
        >
          <option value="">Product Category</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.tags || ""}
          onChange={e => update("tags", e.target.value)}
        >
          <option value="">Tags</option>
          <option value="jeans">jeans</option>
          <option value="sports">sports</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.payment_methods || ""}
          onChange={e => update("payment_methods", e.target.value)}
        >
          <option value="">Payment Method</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.sort_by || ""}
          onChange={(e) => update("sort_by", e.target.value)}
        >
          <option disabled value="">Date</option>
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
        </select>

      </div>

      <div className="p-2">
        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200  rounded"
          value={filters.sort_by || "customer_name"}
          onChange={e => update("sort_by", e.target.value)}
        >
          <option value="customer_name">Sort: Customer Name (A–Z)</option>
          <option value="date">Sort: Date</option>
          <option value="quantity">Sort: Quantity</option>
        </select>
      </div>
      <StatsBoxes />
    </div>
  );
}
