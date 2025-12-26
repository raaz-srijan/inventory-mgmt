const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true,
    },

    content:{
        type:String,
        required:true,
        trim:true,
    },

    businessId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Business",
    },

    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    scope:{
        type:String,
        enum:["Global", "Admin", "Business"],
        required:true,
    },
}, {timestamps:true});

module.exports = mongoose.model("Post", postSchema);