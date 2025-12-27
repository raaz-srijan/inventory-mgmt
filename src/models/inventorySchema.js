const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
    },

    name: {
        type: String,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    stock: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },


}, { timestamps: true });

inventorySchema.index({ businessId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);