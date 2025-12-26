const rolesData = [
  { name: "super_admin", level: 1 },
  { name: "admin", level: 2 },
  { name: "owner", level: 3 },
  { name: "manager", level: 4 },
  { name: "staff", level: 5 },
];


const permissionsData = [
  // PLATFORM
  "manage_platform",
  "view_error_logs",
  "fix_bugs",
  "post_global_announcements",

  // ADMIN
  "verify_business_registration",
  "approve_owner_accounts",
  "post_admin_notices",

  // BUSINESS OWNER
  "manage_business_roles",
  "assign_business_permissions",
  "approve_managers",
  "view_business_dashboard",
  "post_business_notices",

  // MANAGER
  "manage_staff_roles",
  "update_inventory",
  "view_reports",
  "view_manager_dashboard",
  "request_permission_changes",

  // STAFF
  "view_assigned_inventory",
  "update_limited_data",
  "view_notices",

  // COMMON
  "chat_internal",
  "report_bugs",
];

const rolePermissions = {
  super_admin: [
    "manage_platform",
    "view_error_logs",
    "fix_bugs",
    "post_global_announcements",
    "chat_internal",
  ],

  admin: [
    "verify_business_registration",
    "approve_owner_accounts",
    "post_admin_notices",
    "chat_internal",
  ],

  owner: [
    "manage_business_roles",
    "assign_business_permissions",
    "approve_managers",
    "view_business_dashboard",
    "post_business_notices",
    "chat_internal",
    "report_bugs",
  ],

  manager: [
    "manage_staff_roles",
    "update_inventory",
    "view_reports",
    "view_manager_dashboard",
    "request_permission_changes",
    "chat_internal",
    "report_bugs",
  ],

  staff: [
    "view_assigned_inventory",
    "update_limited_data",
    "view_notices",
    "chat_internal",
    "report_bugs",
  ],
};


module.exports = {rolesData, permissionsData, rolePermissions};