const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customer_id : {
        type:String,
        required:true,
        unique:true
    },
    name : {
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    gender : {
        type:String
    },
    age:{
        type:Number
    },
    region:{
        type:String
    },
    customer_type:{
        type:String
    },
},{ timestamps: true });

CustomerSchema.index({name:'text', phone:'text'})

module.exports = mongoose.model('customer', CustomerSchema);