import React, { useEffect, useState } from "react";
import Filters from "../components/Filters";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import { fetchTransactions } from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Transactions() {
  const [filters, setFilters] = useState({
    q: "",
    regions: "",
    genders: "",
    categories: "",
    tags: "",
    payment_methods: "",
    sort_by: "customer_name",
    page: 1
  });

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 10, total_pages: 1, total_items: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions(filters);
      setData(res.data || []);
      setMeta(res.meta || { page: 1, page_size: 10, total_pages: 1, total_items: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [JSON.stringify(filters)]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1  max-w-7xl mx-auto">
        <Filters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="mt-6 p-6 bg-white rounded shadow text-center">
            Loading...
          </div>
        ) : (
          <>
            <Table data={data} />
            <Pagination
              meta={meta}
              onPageChange={(p) =>
                setFilters(prev => ({ ...prev, page: p }))
              }
            />
          </>
        )}
      </div>

    </div>

  );
}
