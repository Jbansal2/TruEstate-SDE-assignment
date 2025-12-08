import React from "react";
import {
  FiHome,
  FiGrid,
  FiLayers,
  FiFileText,
  FiCircle
} from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-4 flex flex-col">

      {/* Top User Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-md bg-indigo-600 text-white font-semibold flex items-center justify-center">
          V
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Vault</p>
          <p className="text-xs text-gray-500">Anurag Yadav</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="space-y-1 text-sm">

        {/* Dashboard */}
        <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
          <FiHome className="text-lg" />
          Dashboard
        </button>

        {/* Nexus */}
        <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
          <FiGrid className="text-lg" />
          Nexus
        </button>

        {/* Intake */}
        <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
          <FiLayers className="text-lg" />
          Intake
        </button>

        {/* SERVICES HEADER */}
        <p className="text-xs text-gray-400 uppercase mt-4 mb-1 px-2">Services</p>

        {/* Services Items */}
        <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FiCircle className="text-xs" />
          Pre-active
        </button>

        <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FiCircle className="text-xs" />
          Active
        </button>

        <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FiCircle className="text-xs" />
          Blocked
        </button>

        <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FiCircle className="text-xs" />
          Closed
        </button>

        {/* INVOICES HEADER */}
        <p className="text-xs text-gray-400 uppercase mt-4 mb-1 px-2">Invoices</p>

        <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FiFileText className="text-xs" />
          Proforma Invoices
        </button>

        <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
          <FiFileText className="text-xs" />
          Final Invoices
        </button>

      </nav>

    </aside>
  );
}
