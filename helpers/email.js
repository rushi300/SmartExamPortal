require("dotenv/config");
const nodemailer = require('nodemailer');
const Student = require("../models/student");
const Organisation = require("../models/organisation");

async function studentEmailExists (enteredEmail) {
    var emailExists = true;
    await Student.findOne({ email: enteredEmail }, (err, foundStudent) => {
        if (foundStudent == null) 
            emailExists = false;
    });
    return emailExists;
}

async function organisationEmailExists(enteredEmail) {
    var emailExists = true;
    await Organisation.findOne({ email: enteredEmail }, (err, foundOrganisation) => {
        if (foundOrganisation == null)
            emailExists = false;
    });
    return emailExists;
}

function sendEmail(email,subjectOfEmail, textToBeSentInEmail) {
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.email,
            pass: process.env.password,
        },
    });

    transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: subjectOfEmail,
        text: textToBeSentInEmail
    });

    transporter.close();
}


module.exports = {
    sendEmail: sendEmail,
    studentEmailExists: studentEmailExists,
    organisationEmailExists: organisationEmailExists
}