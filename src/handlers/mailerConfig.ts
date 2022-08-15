import { createTransport } from 'nodemailer'

const transporter = createTransport({
    service: "Gmail",
    auth: {
        user: "noreply.willowapp@gmail.com",
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
    }
});

export default transporter;