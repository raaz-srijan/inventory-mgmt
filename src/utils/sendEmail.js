const transporter = require("./transporter");

async function sendVerifiedMail(to, businessName) {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: to,
            subject: "Business Verification Approved",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4CAF50;">Congratulations!</h2>
                    <p>Your business, <strong>${businessName}</strong>, has been successfully verified by our administrators.</p>
                    <p>You can now log in to your dashboard and start managing your inventory and staff.</p>
                    <br>
                    <p>Thank you for joining us!</p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending verified email:", error);
        throw error;
    }
}

async function sendRejectionMail(to, businessName, reason) {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: to,
            subject: "Business Verification Update",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #f44336;">Update Regarding Your Business Verification</h2>
                    <p>We regret to inform you that the verification for <strong>${businessName}</strong> could not be completed at this time.</p>
                    <p><strong>Reason:</strong> ${reason || "Information provided does not meet our requirements."}</p>
                    <p>Please update your business details or upload clearer documents and resubmit for verification.</p>
                    <br>
                    <p>Best regards,<br>The Inventory Management Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Rejection Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending rejection email:", error);
        throw error;
    }
}

async function sendRegistrationMail(to, userName, businessName) {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: to,
            subject: "Business Registration Received",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2196F3;">Registration Received</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for registering <strong>${businessName}</strong>. Your documents have been received and are currently being reviewed by our team.</p>
                    <p>We will notify you via email once the verification process is complete.</p>
                    <br>
                    <p>Best regards,<br>The Inventory Management Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Registration Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending registration email:", error);
        throw error;
    }
}

module.exports = { sendVerifiedMail, sendRejectionMail, sendRegistrationMail };