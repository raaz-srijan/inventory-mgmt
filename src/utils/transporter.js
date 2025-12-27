const nodemailer = require("nodemailer");

const transporter = create.nodemailer({

    services: "gmail",
    port: 465,
    secure:true,
    auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASS
    }
})

module.exports = transporter;