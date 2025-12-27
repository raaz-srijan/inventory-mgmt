const Role = require("../models/roleSchema");
const Permission = require("../models/permissionSchema");

async function createRole(req, res) {
  try {
    const { name, level, permissions } = req.body;

    if (!name || !level) {
      return res.status(400).json({ success: false, message: "Name and level are required" });
    }

    const newRole = await Role.create({ name, level, permissions });
    return res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function getAllRoles(req, res) {
  try {
    const roles = await Role.find().populate("permissions", "name group");
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function getRoleById(req, res) {
  try {
    const { roleId } = req.params;

    const role = await Role.findById(roleId).populate("permissions", "name group");
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });

    return res.status(200).json({ success: true, data: role });
  } catch (error) {
    console.error("Error fetching role:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function updateRole(req, res) {
  try {
    const { roleId } = req.params;
    const { name, level, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { name, level, permissions },
      { new: true }
    ).populate("permissions", "name group");

    if (!updatedRole) return res.status(404).json({ success: false, message: "Role not found" });

    return res.status(200).json({ success: true, data: updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

async function deleteRole(req, res) {
  try {
    const { roleId } = req.params;

    const deletedRole = await Role.findByIdAndDelete(roleId);
    if (!deletedRole) return res.status(404).json({ success: false, message: "Role not found" });

    return res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
