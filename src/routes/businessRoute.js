const express = require("express");
const {
  createBusinessId,
  getBusiness,
  getBusinessById,
  deleteBusinessId,
  updateBusinessId
} = require("../controllers/businessController");
const { authenticate, authorize, checkBusinessAccess } = require("../middlewares/authMiddleware");

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

router.get("/", authenticate, authorize("verify_business_registration"), getBusiness);

router.get("/:businessId", authenticate, (req, res, next) => {
  if (req.user.role.name === 'super_admin' || req.user.role.name === 'admin') {
    return next(); 
  }
  return checkBusinessAccess(req, res, next);
}, getBusinessById);

router.patch(
  "/:businessId/update",
  authenticate,
  authorize("manage_business_roles"), 
  checkBusinessAccess,
  upload.fields([
    { name: "licenseImg", maxCount: 1 },
    { name: "citizenshipImgFront", maxCount: 1 },
    { name: "citizenshipImgBack", maxCount: 1 },
  ]),
  updateBusinessId
);

router.delete("/:businessId", authenticate, authorize("manage_platform"), deleteBusinessId);

module.exports = router;
