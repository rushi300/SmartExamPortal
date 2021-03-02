require("dotenv/config");
const nodemailer = require('nodemailer');

function sendEmail(email,subjectOfEmail, textToBeSentInEmail) {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "parthshah1936@gmail.com",
            pass: process.env.password,
        },
    });

    transporter.sendMail({
        from: "parthshah1936@gmail.com",
        to: email,
        subject: subjectOfEmail,
        text: textToBeSentInEmail
    });

    transporter.close();
}

module.exports = {
    sendEmail: (email,subjectOfEmail, textToBeSentInEmail) => {
        return sendEmail(email,subjectOfEmail, textToBeSentInEmail);
    }
}