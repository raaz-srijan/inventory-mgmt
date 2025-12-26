const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
    },
    
    license:{
        type:String,
        required:true,
        trim:true,
    },

    isVerified:{
        type:String,
        required:true,
        default:false,
    },

    licenseImg:{
        imageUrl:{
            type:String,
        },

        publicId:{
            type:String,
            required:true,
        },
    },

    citizenshipImg:{
        imageUrl:{
            type:String,
        },

        publicId:{
            type:String,
            required:true,
        },
    },

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
}, {timestamps:true});

module.exports = mongoose.model("Business", businessSchema);