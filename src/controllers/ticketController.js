const Ticket = require("../models/ticketSchema");

async function createTicket(req, res) {
    try {
        const { type, description } = req.body;
        const user = req.user;

        const ticket = await Ticket.create({
            createdBy: user._id,
            businessId: user.businessId,
            type, // e.g., "Bug", "Support"
            description
        });

        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getAllTickets(req, res) {
    try {
        // SuperAdmin/Admin can see all tickets
        const tickets = await Ticket.find()
            .populate("createdBy", "name email")
            .populate("businessId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateTicketStatus(req, res) {
    try {
        const { ticketId } = req.params;
        const { status, assignedTo } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status, assignedTo },
            { new: true }
        );

        if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getMyBusinessTickets(req, res) {
    try {
        const tickets = await Ticket.find({ businessId: req.user.businessId })
            .populate("assignedTo", "name role");

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createTicket, getAllTickets, updateTicketStatus, getMyBusinessTickets };
