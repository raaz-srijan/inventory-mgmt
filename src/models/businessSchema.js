const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    license: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    licenseImg: {
      imageUrl: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },

    address: {
      type: String,
      required: true,
    },

    citizenshipImg: {
      front: {
        imageUrl: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
      back: {
        imageUrl: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
