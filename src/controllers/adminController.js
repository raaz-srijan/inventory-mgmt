const Business = require("../models/businessSchema");
const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const mongoose = require("mongoose");
const { sendVerifiedMail, sendRejectionMail } = require("../utils/sendEmail");

async function verifyBusiness(req, res) {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID",
      });
    }

    if (!req.user || req.user.role?.name !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (business.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Business already verified",
      });
    }

    business.isVerified = true;
    await business.save();

    const ownerRole = await Role.findOne({ name: "owner" });

    if (!ownerRole) {
      return res.status(500).json({
        success: false,
        message: "Owner role not found",
      });
    }

    const owner = await User.findByIdAndUpdate(
      business.ownerId,
      {
        role: ownerRole._id,
        isVerify: true,
      },
      { new: true }
    );

    // Send verification email
    try {
      await sendVerifiedMail(owner.email, business.name);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // We don't return error here because the verification itself succeeded
    }

    return res.status(200).json({
      success: true,
      message: "Business verified and owner role assigned",
    });

  } catch (error) {
    console.error("Error verifying business:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function rejectBusiness(req, res) {
  try {
    const { businessId } = req.params;
    const { reason } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (!business.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Business is already unverified",
      });
    }

    business.isVerified = false;
    await business.save();

    const owner = await User.findById(business.ownerId);

    // Send rejection email
    try {
      if (owner) {
        await sendRejectionMail(owner.email, business.name, reason);
      }
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Business rejected successfully",
    });

  } catch (error) {
    console.error("Error rejecting business:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function reassignBusinessOwner(req, res) {
  try {
    const { businessId } = req.params;
    const { newOwnerId } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (business.ownerId.toString() === newOwnerId) {
      return res.status(400).json({
        success: false,
        message: "User is already the owner",
      });
    }

    const newOwner = await User.findById(newOwnerId);
    if (!newOwner) {
      return res.status(404).json({
        success: false,
        message: "New owner not found",
      });
    }

    const ownerRole = await Role.findOne({ name: "owner" });
    if (!ownerRole) {
      return res.status(500).json({
        success: false,
        message: "Owner role not found",
      });
    }

    await User.findByIdAndUpdate(
      business.ownerId,
      {
        businessId: null,
      }
    );

    await User.findByIdAndUpdate(
      newOwnerId,
      {
        businessId: business._id,
        role: ownerRole._id,
        isVerify: true,
      }
    );

    business.ownerId = newOwnerId;
    await business.save();

    return res.status(200).json({
      success: true,
      message: "Business ownership reassigned successfully",
    });

  } catch (error) {
    console.error("Error reassigning business owner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function deleteBusiness(req, res) {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID",
      });
    }

    if (!req.user || req.user.role?.name !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const userRole = await Role.findOne({ name: "owner" });

    await User.findByIdAndUpdate(
      business.ownerId,
      {
        businessId: null,
        role: userRole ? userRole._id : null,
      }
    );

    await Business.findByIdAndDelete(businessId);

    return res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting business:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { verifyBusiness, rejectBusiness, reassignBusinessOwner, deleteBusiness };
