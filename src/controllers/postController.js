const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const { createNotification } = require("./notificationController");

async function createPost(req, res) {
    try {
        const { title, content, scope, businessId } = req.body;
        const user = req.user;

        if (scope === 'Global' || scope === 'Admin') {
            if (user.role.name !== 'super_admin' && user.role.name !== 'admin') {
                return res.status(403).json({ success: false, message: "Only Admins can create Global/Admin posts." });
            }
        } else if (scope === 'Business') {
            if (!businessId) return res.status(400).json({ success: false, message: "BusinessId is required for business scope." });

            if (user.businessId?.toString() !== businessId.toString() ||
                (user.role.name !== 'owner' && user.role.name !== 'manager')) {
                return res.status(403).json({ success: false, message: "Unauthorized to post for this business." });
            }
        }

        const post = await Post.create({
            title,
            content,
            scope,
            businessId: scope === 'Business' ? businessId : null,
            postedBy: user._id
        });

        res.status(201).json({ success: true, data: post });

        // Generate Notifications asynchronously
        (async () => {
            if (scope === 'Business') {
                const businessUsers = await User.find({ businessId: businessId });
                for (const bUser of businessUsers) {
                    if (bUser._id.toString() !== user._id.toString()) {
                        await createNotification({
                            recipientId: bUser._id,
                            senderId: user._id,
                            businessId: businessId,
                            type: "Post",
                            title: `New Notice: ${title}`,
                            message: `${user.name} posted a new notice for your business.`,
                            link: `/notices/${post._id}`
                        });
                    }
                }
            } else if (scope === 'Global') {
                // For high-end, you might notify everyone or just specific roles
                // Here we notify active owners/managers of global updates
                const activeStaff = await User.find({ isVerify: true });
                for (const staffUser of activeStaff) {
                    if (staffUser._id.toString() !== user._id.toString()) {
                        await createNotification({
                            recipientId: staffUser._id,
                            senderId: user._id,
                            type: "Post",
                            title: `Global Announcement: ${title}`,
                            message: `Platform administrators have posted a new global announcement.`,
                            link: `/notices/${post._id}`
                        });
                    }
                }
            }
        })();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getPosts(req, res) {
    try {
        const user = req.user;
        const query = {
            $or: [
                { scope: "Global" },
                { scope: "Admin", $or: [{ "role.name": "admin" }, { "role.name": "super_admin" }] } // Basic logic
            ]
        };

        if (user.businessId) {
            query.$or.push({ scope: "Business", businessId: user.businessId });
        }

        const posts = await Post.find(query).populate("postedBy", "name role").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createPost, getPosts };
