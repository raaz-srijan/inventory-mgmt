const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const { createNotification } = require("./notificationController");

async function sendMessage(req, res) {
    try {
        const sender = req.user;
        const { receiverId, content } = req.body;

        const receiver = await User.findById(receiverId).populate("role");
        if (!receiver) return res.status(404).json({ success: false, message: "Receiver not found" });

        const senderRole = sender.role.name;
        const receiverRole = receiver.role.name;

        // Restriction Logic based on the provided diagram
        let allowed = false;

        if (senderRole === 'staff') {
            // Staff to Staff of same business
            if (receiverRole === 'staff' && sender.businessId.toString() === receiver.businessId?.toString()) {
                allowed = true;
            }
        } else if (senderRole === 'manager') {
            // Manager to Owner & Staffs of own business
            if ((receiverRole === 'owner' || receiverRole === 'staff') &&
                sender.businessId.toString() === receiver.businessId?.toString()) {
                allowed = true;
            }
        } else if (senderRole === 'owner') {
            // Owner to Manager & Staffs of own business, and to Admin
            if (sender.businessId.toString() === receiver.businessId?.toString() &&
                (receiverRole === 'manager' || receiverRole === 'staff')) {
                allowed = true;
            } else if (receiverRole === 'admin' || receiverRole === 'super_admin') {
                allowed = true;
            }
        } else if (senderRole === 'admin' || senderRole === 'super_admin') {
            // Admins can message any Owner (for business verification etc)
            if (receiverRole === 'owner') {
                allowed = true;
            }
            // And each other
            if (receiverRole === 'admin' || receiverRole === 'super_admin') {
                allowed = true;
            }
        }

        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to send messages to this user based on your role and business association."
            });
        }

        const newMessage = await Message.create({
            senderId: sender._id,
            recieverId: receiverId,
            businessId: sender.businessId,
            content
        });

        res.status(201).json({ success: true, data: newMessage });

        // Notify Receiver
        (async () => {
            await createNotification({
                recipientId: receiverId,
                senderId: sender._id,
                businessId: sender.businessId,
                type: "Message",
                title: `New Message from ${sender.name}`,
                message: content.length > 50 ? content.substring(0, 47) + "..." : content,
                link: `/messages`
            });
        })();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getMessages(req, res) {
    try {
        const userId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { recieverId: userId }
            ]
        }).populate("senderId recieverId", "name email role");

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { sendMessage, getMessages };
