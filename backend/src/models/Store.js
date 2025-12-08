const mongoose = require('mongoose');

const StroreSchema = new mongoose.Schema({
    store_id:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String,
    },
},{ timestamps: true });

module.exports = mongoose.model('store', StroreSchema);