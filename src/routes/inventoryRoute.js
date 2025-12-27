const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    createInventoryItem,
    getInventory,
    updateInventoryItem,
    deleteInventoryItem
} = require("../controllers/inventoryController");
const { authenticate, authorize, checkBusinessAccess } = require("../middlewares/authMiddleware");

router.use(authenticate, checkBusinessAccess);

router.post("/", authorize("update_inventory"), createInventoryItem);
router.get("/", authorize("view_assigned_inventory"), getInventory);
router.patch("/:itemId", authorize("update_inventory"), updateInventoryItem);
router.delete("/:itemId", authorize("manage_business_roles"), deleteInventoryItem); 

module.exports = router;
