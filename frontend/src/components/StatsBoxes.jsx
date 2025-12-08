import React from "react";
import { BsExclamationCircle } from "react-icons/bs";

const StatsBoxes = () => {
    const stats = [
        {
            title: "Total Units Sold",
            value: "10",
            sub: "",
        },
        {
            title: "Total Amount",
            value: "₹89,000",
            sub: "(19 SRs)",
        },
        {
            title: "Total Discount",
            value: "₹15000",
            sub: "(45 SRs)",
        },
    ];

    return (
        <div className="flex gap-4 mt-4 px-2 flex-wrap">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-300 rounded-md px-4 py-3 w-48 shadow-sm"
                >
                    <div className="flex items-center justify-between gap-1 text-black text-sm">
                        <span>{stat.title}</span>
                        <BsExclamationCircle className="text-gray-400 text-sm" />
                    </div>
                    <div className="flex items-center text-lg font-semibold">
                        <p className="text-lg font-semibold ">{stat.value}</p>
                        {stat.sub && (
                            <p className="text-lg text-black ml-1 font-semibold"> {stat.sub}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsBoxes;
