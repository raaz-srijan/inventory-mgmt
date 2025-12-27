const express = require("express");
const { createBusinessId, getBusiness, getBusinessById, deleteBusinessId } = require("../controllers/businessController");

const router = express.Router();

const upload = require("../utils/multer");

router.post(
  "/register",
  upload.fields([
    { name: "licenseImg", maxCount: 1 },
    { name: "citizenshipImgFront", maxCount: 1 },
    { name: "citizenshipImgBack", maxCount: 1 },
  ]),
  createBusinessId
);

router.patch(
  "/update",
  upload.fields([
    { name: "licenseImg", maxCount: 1 },
    { name: "citizenshipImgFront", maxCount: 1 },
    { name: "citizenshipImgBack", maxCount: 1 },
  ])
);

router.get("/", getBusiness);

router.get("/:businessId", getBusinessById);

router.delete("/:businessId", deleteBusinessId);

module.exports = router;
