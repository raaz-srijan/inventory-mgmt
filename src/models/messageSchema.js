const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    businessId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Business",
    },

    content:{
        type:String,
        required:true,
    },
}, {timestamps:true});

module.exports = mongoose.model("Message", messageSchema);