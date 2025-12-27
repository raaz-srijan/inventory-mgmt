const Permission = require("../models/permissionSchema");

async function createPermission(req, res) {
  try {
    const { name, group } = req.body;

    if (!name || !group) {
      return res.status(400).json({ success: false, message: "Name and group are required" });
    }

    const newPermission = await Permission.create({ name, group });
    return res.status(201).json({ success: true, data: newPermission });
  } catch (error) {
    console.error("Error creating permission:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function getAllPermissions(req, res) {
  try {
    const permissions = await Permission.find();
    return res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function getPermissionById(req, res) {
  try {
    const { permissionId } = req.params;

    const permission = await Permission.findById(permissionId);
    if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });

    return res.status(200).json({ success: true, data: permission });
  } catch (error) {
    console.error("Error fetching permission:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function updatePermission(req, res) {
  try {
    const { permissionId } = req.params;
    const { name, group } = req.body;

    const updatedPermission = await Permission.findByIdAndUpdate(
      permissionId,
      { name, group },
      { new: true }
    );

    if (!updatedPermission) return res.status(404).json({ success: false, message: "Permission not found" });

    return res.status(200).json({ success: true, data: updatedPermission });
  } catch (error) {
    console.error("Error updating permission:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function deletePermission(req, res) {
  try {
    const { permissionId } = req.params;

    const deletedPermission = await Permission.findByIdAndDelete(permissionId);
    if (!deletedPermission) return res.status(404).json({ success: false, message: "Permission not found" });

    return res.status(200).json({ success: true, message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
};
