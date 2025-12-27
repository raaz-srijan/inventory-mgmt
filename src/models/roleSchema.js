const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        default:null,
    },

    level:{
        type:Number,
        required:true,
        trim:true,
        default:null,
    },

    permissions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Permission",
    }],
    
}, {timestamps:true});


module.exports = mongoose.model("Role", roleSchema);