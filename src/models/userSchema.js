const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
    },

    email:{
        type:String,
        required:true,
        lowercase:true,
    },

    password:{
        type:String,
        required:true,
        minlength:6,
    },

    isVerify:{
        type:Boolean,
        required:true,
        default:false,
    },

    businessId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Business",
        default:null,
    },

    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        default:null,
    },
    
}, {timestamps:true});

module.exports = mongoose.model("User", userSchema);