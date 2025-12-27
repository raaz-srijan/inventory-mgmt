const Inventory = require("../models/inventorySchema");
const User = require("../models/userSchema");
const { createNotification } = require("./notificationController");
const { logActivity } = require("./activityController");

async function createInventoryItem(req, res) {
    try {
        const { businessId } = req.params;
        const { name, quantity, stock, price } = req.body;

        const newItem = await Inventory.create({
            businessId,
            name,
            quantity,
            stock,
            price
        });

        // Log Activity
        await logActivity({
            userId: req.user._id,
            businessId: businessId,
            action: "CREATE_INVENTORY_ITEM",
            module: "INVENTORY",
            details: { itemName: name, quantity, price },
            req
        });

        res.status(201).json({ success: true, data: newItem });

        // Notify Owners/Managers
        (async () => {
            const usersToNotify = await User.find({
                businessId: businessId,
                role: { $in: await getOwnerManagerRoleIds() }
            });
            for (const user of usersToNotify) {
                if (user._id.toString() !== req.user._id.toString()) {
                    await createNotification({
                        recipientId: user._id,
                        senderId: req.user._id,
                        businessId: businessId,
                        type: "Inventory",
                        title: "New Inventory Item",
                        message: `${req.user.name} added a new item: ${name}`,
                        link: `/inventory`
                    });
                }
            }
        })();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Item with this name already exists in this business." });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getInventory(req, res) {
    try {
        const { businessId } = req.params;
        const items = await Inventory.find({ businessId });
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateInventoryItem(req, res) {
    try {
        const { itemId } = req.params;
        const updateData = req.body;

        const item = await Inventory.findByIdAndUpdate(itemId, updateData, { new: true });
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        // Log Activity
        await logActivity({
            userId: req.user._id,
            businessId: item.businessId,
            action: "UPDATE_INVENTORY_ITEM",
            module: "INVENTORY",
            details: { itemName: item.name, updateData },
            req
        });

        res.status(200).json({ success: true, data: item });

        // Notify Owners/Managers of update
        (async () => {
            const usersToNotify = await User.find({
                businessId: item.businessId,
                role: { $in: await getOwnerManagerRoleIds() }
            });
            for (const user of usersToNotify) {
                if (user._id.toString() !== req.user._id.toString()) {
                    await createNotification({
                        recipientId: user._id,
                        senderId: req.user._id,
                        businessId: item.businessId,
                        type: "Inventory",
                        title: "Inventory Updated",
                        message: `${req.user.name} updated item: ${item.name}`,
                        link: `/inventory`
                    });
                }
            }
        })();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteInventoryItem(req, res) {
    try {
        const { itemId } = req.params;
        const item = await Inventory.findByIdAndDelete(itemId);

        if (item) {
            await logActivity({
                userId: req.user._id,
                businessId: item.businessId,
                action: "DELETE_INVENTORY_ITEM",
                module: "INVENTORY",
                details: { itemName: item.name },
                req
            });
        }

        res.status(200).json({ success: true, message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getOwnerManagerRoleIds() {
    const Role = require("../models/roleSchema");
    const roles = await Role.find({ name: { $in: ["owner", "manager"] } });
    return roles.map(r => r._id);
}

module.exports = { createInventoryItem, getInventory, updateInventoryItem, deleteInventoryItem };
