const nodemailer = require('nodemailer');
require ('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "noreply.willowapp@gmail.com",
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
    }
});

module.exports = transporter;