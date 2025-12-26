const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

    businessId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Business",
    },

    name:{
        type:String,
        required:true,
        unique:true,
    },

    quantity:{
        type:Number,
        required:true,
    },

    stock:{
        type:Number,
        required:true
    },

    price:{
        type:Number,
        required:true,
    },


}, {timestamps:true});

module.exports = mongoose.model("Inventory", inventorySchema);