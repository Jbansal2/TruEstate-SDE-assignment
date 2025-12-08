import React, { useState } from "react";
import {
    FiHome,
    FiGrid,
    FiLayers
} from "react-icons/fi";

import { MdExpandMore } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";
import { IoPlayCircleOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { GoIssueClosed } from "react-icons/go";
import { PiClipboardLight } from "react-icons/pi";
import { TfiClipboard } from "react-icons/tfi";

export default function Sidebar() {
    const [openServices, setOpenServices] = useState(true);
    const [openInvoices, setOpenInvoices] = useState(true);

    return (
        <aside className="w-55 h-screen bg-gray-200 border-r p-2 border-gray-200 flex flex-col">

            <div className="flex items-center justify-between gap-3 mb-6 p-2 bg-white shadow">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-md bg-indigo-600 text-white font-semibold flex items-center justify-center">
                        V
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">Vault</p>
                        <p className="text-xs text-gray-500">Anurag Yadav</p>
                    </div>
                </div>
                <MdExpandMore className="cursor-pointer" />
            </div>

            <nav className="text-sm">
                <button className="flex items-center gap-3 w-full text-left cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                    <FiHome className="text-lg" />
                    Dashboard
                </button>

                <button className="flex items-center gap-3 w-full text-left cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                    <FiGrid className="text-lg" />
                    Nexus
                </button>

                <button className="flex items-center gap-3 w-full text-left cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800">
                    <FiLayers className="text-lg" />
                    Intake
                </button>

                <div className="text-sm text-gray-600 mt-4 mb-1 bg-white p-2 rounded shadow">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setOpenServices(!openServices)}
                    >
                        <div className="flex gap-2 items-center">
                            <CiFileOn />
                            <span>Services</span>
                        </div>

                        <MdExpandMore
                            className={`transition-transform duration-200 ${openServices ? "rotate-180" : "rotate-0"}`}
                        />
                    </div>

                    {openServices && (
                        <div>
                            <button className="flex items-center gap-2 w-full text-left pl-8 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-gray-700">
                                <IoPlayCircleOutline className="text-xs" />
                                Pre-active
                            </button>

                            <button className="flex items-center gap-2 w-full text-left pl-8 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                                <PiClipboardLight className="text-xs" />
                                Active
                            </button>

                            <button className="flex items-center gap-2 w-full text-left pl-8 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-gray-700">
                                <MdBlock className="text-xs" />
                                Blocked
                            </button>

                            <button className="flex items-center gap-2 w-full text-left pl-8 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-gray-700">
                                <GoIssueClosed className="text-xs" />
                                Closed
                            </button>
                        </div>
                    )}
                </div>

                <div className="text-sm text-gray-600 mt-2 mb-1 bg-white p-2 rounded shadow">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setOpenInvoices(!openInvoices)}
                    >
                        <div className="flex gap-2 items-center">
                            <CiFileOn />
                            <span>Invoices</span>
                        </div>

                        <MdExpandMore
                            className={`transition-transform duration-200 ${openInvoices ? "rotate-180" : "rotate-0"}`}
                        />
                    </div>

                    {openInvoices && (
                        <div>
                            <button className="flex items-center gap-2 w-full text-left pl-8 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-gray-700">
                                <TfiClipboard className="text-xs" />
                                Proforma Invoices
                            </button>

                            <button className="flex items-center gap-2 w-full text-left pl-8 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-gray-700">
                                <TfiClipboard className="text-xs" />
                                Final Invoices
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}
