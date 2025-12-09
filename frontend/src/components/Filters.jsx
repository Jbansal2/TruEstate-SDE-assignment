import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import StatsBoxes from "./StatsBoxes";
import Refresh from "./Refresh";

export default function Filters({ filters, setFilters }) {
  const update = (key, value) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value === "" || value === null || value === undefined) {
        delete next[key];
      } else {
        next[key] = value;
      }
      next.page = 1;
      return next;
    });
  };

  const [localQ, setLocalQ] = useState(filters.q || "");
  const debounceRef = useRef(null);
  useEffect(() => {
    setLocalQ(filters.q || "");
  }, [filters.q]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!localQ) update("q", "");
      else update("q", localQ.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  const handleDateSort = (val) => {
    if (!val) {
      update("sort_by", "");
      update("sort_order", "");
      return;
    }
    if (val === "date_desc") {
      update("sort_by", "date");
      update("sort_order", "desc");
    } else if (val === "date_asc") {
      update("sort_by", "date");
      update("sort_order", "asc");
    }
  };

  const handleOtherSort = (val) => {
    if (!val) {
      update("sort_by", "");
      update("sort_order", "");
      return;
    }
    if (val === "customer_name") {
      update("sort_by", "customer_name");
      update("sort_order", "asc");
    } else if (val === "date") {
      update("sort_by", "date");
      update("sort_order", "desc");
    } else if (val === "quantity") {
      update("sort_by", "quantity");
      update("sort_order", "desc");
    } else {
      update("sort_by", val);
      update("sort_order", "asc");
    }
  };

  return (
    <div className="flex flex-wrap justify-between rounded">
      <div className="flex items-center gap-4 mb-5 w-full justify-between bg-white px-4 py-3 rounded shadow">
        <div>
          <h1 className="font-bold text-2xl">Sales Management System</h1>
        </div>

        <div className="flex items-center gap-2 border px-3 py-1 rounded bg-gray-200">
          <CiSearch />
          <input
            type="text"
            placeholder="Name, Phone no."
            value={localQ}
            onChange={e => setLocalQ(e.target.value)}
            className="w-64 px-3 py-1 border rounded outline-none border-none text-sm bg-gray-200"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center p-2 gap-2">
        <Refresh onRefresh={() => {
          setFilters({
            page: 1,
            sort_by: "date",
            sort_order: "desc"
          });
        }} />

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.regions || ""}
          onChange={e => update("regions", e.target.value)}
        >
          <option value="">Customer Region</option>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Central">Central</option>
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
          value={filters.age_range || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              update("age_min", "");
              update("age_max", "");
              update("age_range", "");
              return;
            }
            const [min, max] = val.split("-").map(Number);
            update("age_min", min);
            update("age_max", max);
            update("age_range", val);
          }}
        >
          <option value="">Age Range</option>
          <option value="18-25">18 - 25</option>
          <option value="26-35">26 - 35</option>
          <option value="36-45">36 - 45</option>
          <option value="46-60">46 - 60</option>
          <option value="60-99">60+</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.categories || ""}
          onChange={e => update("categories", e.target.value)}
        >
          <option value="">Product Category</option>
          <option value="Beauty">Beauty</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.tags || ""}
          onChange={e => update("tags", e.target.value)}
        >
          <option value="">Tags</option>
          <option value="organic">organic</option>
          <option value="formal">formal</option>
          <option value="casual">casual</option>
          <option value="gadget">gadget</option>
          <option value="cotton">cotton</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.payment_methods || ""}
          onChange={e => update("payment_methods", e.target.value)}
        >
          <option value="">Payment Method</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Credit Card">Credit Card</option>
          <option value="NetBanking">Net Banking</option>
          <option value="UPI">UPI</option>
          <option value="Wallet">Wallet</option>
          <option value="Cash">Cash</option>
        </select>

        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200 rounded"
          value={filters.sort_by === "date" ? (filters.sort_order === "asc" ? "date_asc" : "date_desc") : ""}
          onChange={e => handleDateSort(e.target.value)}
        >
          <option value="">Date</option>
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
        </select>

      </div>

      <div className="p-2">
        <select
          className="px-2 py-1 outline-none text-sm bg-gray-200  rounded"
          value={filters.sort_by || "customer_name"}
          onChange={e => handleOtherSort(e.target.value)}
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
