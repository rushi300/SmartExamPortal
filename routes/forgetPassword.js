require("dotenv/config");
const express = require('express');
const Student = require('../models/student');
const Organisation = require('../models/organisation');
const router = express.Router();
const randomString = require('randomstring');
const email = require('../helpers/email');
const bcrypt = require('bcrypt');

router.get("/forget-password", (req, res) => {
    res.render("forgotPassword"); 
});

router.post("/forget-password", async (req, res) => {
    if (await email.studentEmailExists(req.body.email) || await email.organisationEmailExists(req.body.email)) {
        var verificationCode = randomString.generate(5);
    
        var textToBeSentInEmail = "Your verification code is " + verificationCode;
        var subjectOfEmail = "Password Reset Code";
        email.sendEmail(req.body.email, subjectOfEmail, textToBeSentInEmail);
    
        return res.render("confirmVerificationCode", { verificationCode: verificationCode,email: req.body.email });
    } 
    return res.redirect("back");
});

router.post("/confirmVerificationCode", (req, res) => {
    if (req.body.correctCode != req.body.verificationCode)
        return res.redirect("back");
    
    return res.render("resetPassword", {email: req.body.email});
});

router.post("/reset-password", (req, res) => {
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword)
        return res.redirect("back");
    
    Student.findOne({ email: req.body.email }, (err, foundStudent) => {
        if (!err && foundStudent != null) {
            const hash = bcrypt.hashSync(password, 10);
            foundStudent.passwordHash = hash;
            foundStudent.save();    
            return res.redirect("/login");
        }
    });

    Organisation.findOne({ email: req.body.email }, (err, foundOrganisation) => {
        if (!err && foundOrganisation != null) {
            const hash = bcrypt.hashSync(password, 10);
            foundOrganisation.passwordHash = hash;
            foundOrganisation.save();
            return res.redirect("/login");
        }
    });
});

module.exports = router;