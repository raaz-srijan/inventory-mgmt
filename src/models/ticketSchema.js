const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    type: String,

    status: {
        type: String,
        enum: ["pending", "fixed",],
        default: "pending",
    },

    description: {
        type: String,
        required: true,
    },

}, { timestamps: true });


module.exports = mongoose.model("Ticket", ticketSchema);