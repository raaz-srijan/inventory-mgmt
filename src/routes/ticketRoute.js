const express = require("express");
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    updateTicketStatus,
    getMyBusinessTickets
} = require("../controllers/ticketController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.use(authenticate);

// Owners/Managers can report bugs
router.post("/", authorize("report_bugs"), createTicket);

// SuperAdmin/Admin can fetch and manage all tickets
router.get("/all", authorize("manage_platform"), getAllTickets);
router.patch("/:ticketId", authorize("manage_platform"), updateTicketStatus);

// Business users can see their own status
router.get("/my-business", getMyBusinessTickets);

module.exports = router;
