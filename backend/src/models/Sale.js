const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    sale_id: {
        type: String,
        unique: true,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    price_per_unit: { 
        type: Number
    },
    discount_pct: { 
        type: Number
    },
    total_amount: { 
        type: Number
    },
    final_amount: { 
        type: Number 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    payment_method: { 
        type: String
    },
    order_status: { 
        type: String
    },
    delivery_type: { 
        type: String
    },
    store_id: { 
        type: String 
    },
    salesperson_id: { 
        type: String
    },
    employee_name: { 
        type: String
    }
}, { timestamps: true });

SaleSchema.index({ date: -1 });
SaleSchema.index({ customer_id: 1 });
SaleSchema.index({ product_id: 1 });
SaleSchema.index({ payment_method: 1 });

module.exports = mongoose.model('Sale', SaleSchema);
