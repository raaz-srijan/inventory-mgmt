const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
    },

    group:{
        type:String,
        required:true,
        trim:true,
    }
}, {timestamps:true});

module.exports = mongoose.model("Permission", permissionSchema);