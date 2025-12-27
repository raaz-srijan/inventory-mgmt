const Business = require("../models/businessSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const { uploadImage } = require("../utils/uploadImage");

async function createBusinessId(req, res) {
  try {
    const { businessName, license, address, userName, email, password } = req.body;

    if (!businessName || !license || !address || !userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const licenseImgFile = req.files?.licenseImg?.[0];
    const citizenshipFront = req.files?.citizenshipImgFront?.[0];
    const citizenshipBack = req.files?.citizenshipImgBack?.[0];

    if (!licenseImgFile || !citizenshipFront || !citizenshipBack) {
      return res.status(400).json({
        success: false,
        message: "Please upload all required images",
      });
    }

    const existingUser = await User.findOne({ email });
    const existingBusiness = await Business.findOne({ license });

    if (existingUser || existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "User or Business already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [licenseResult, frontResult, backResult] = await Promise.all([
      uploadImage(licenseImgFile.path),
      uploadImage(citizenshipFront.path),
      uploadImage(citizenshipBack.path),
    ]);

    const newUser = await User.create({
      name: userName,
      email,
      password: hashedPassword,
      isVerify: false,
    });

    const newBusiness = await Business.create({
      name: businessName,
      address,
      license,
      ownerId: newUser._id,
      isVerified: false,
      licenseImg: {
        imageUrl: licenseResult.secure_url,
        publicId: licenseResult.public_id,
      },
      citizenshipImg: {
        front: {
          imageUrl: frontResult.secure_url,
          publicId: frontResult.public_id,
        },
        back: {
          imageUrl: backResult.secure_url,
          publicId: backResult.public_id,
        },
      },
    });

    newUser.businessId = newBusiness._id;
    await newUser.save();

    await newBusiness.populate("ownerId", "name email");

    await Promise.all([
      fs.unlink(licenseImgFile.path),
      fs.unlink(citizenshipFront.path),
      fs.unlink(citizenshipBack.path),
    ]);

    return res.status(201).json({
      success: true,
      message: "Business registered successfully",
      data: {
        business: newBusiness,
        user: newUser,
      },
    });

  } catch (error) {
    console.error("Error creating business id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function updateBusinessId(req, res) {
  try {
    const { businessId } = req.params;
    const { businessName, license, address } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (license && license !== business.license) {
      const existingLicense = await Business.findOne({ license });
      if (existingLicense) {
        return res.status(400).json({
          success: false,
          message: "License already exists",
        });
      }
      business.license = license;
    }

    if (businessName) business.name = businessName;
    if (address) business.address = address;

    await business.save();
    await business.populate("ownerId", "name email");

    return res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: business,
    });

  } catch (error) {
    console.error("Error updating business:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


async function deleteBusinessId(req, res) {
  try {
    const { businessId } = req.params;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    await User.findByIdAndUpdate(
      business.ownerId,
      { businessId: null }
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
    });
  }
}


async function getBusiness(req, res) {
  try {
    const { businessId } = req.params;

    const business = await Business.findById(businessId)
      .populate("ownerId", "name email");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: business,
    });

  } catch (error) {
    console.error("Error getting business:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function getBusinessById(req, res) {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const business = await Business.findById(businessId)
      .populate("ownerId", "name email");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: business,
    });

  } catch (error) {
    console.error("Error fetching business by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {createBusinessId, updateBusinessId, getBusiness, deleteBusinessId, getBusinessById};
