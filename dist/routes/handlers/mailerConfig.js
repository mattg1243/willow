const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "noreply.willowapp@gmail.com",
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
    }
});
module.exports = transporter;
