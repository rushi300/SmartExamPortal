const express = require('express');
const Student = require('../models/student');
const Organisation = require('../models/organisation');
const router = express.Router();

router.get("/forget-password", (req, res) => {
    res.render("forget"); 
});

router.post("/forget-password", async (req, res) => {
    var email = req.body.email;
    var verificationCode = randomString.generate(5);

    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "parthshah1936@gmail.com",
            pass: "adgzcbqet19",
        },
    });

    await transporter.sendMail({
        from: "parthshah1936@gmail.com",
        to: email,
        subject: "Password Reset Code",
        text: "Your verification code is " + verificationCode
    });
    transporter.close();

    res.render("confirmVerificationCode", { verificationCode: verificationCode });

});

router.post("/confirmVerificationCode", (req, res) => {
    if (req.body.correctCode != req.body.verificationCode)
        return res.redirect("back");
    
    return res.render("resetPassword");
});

router.post("/reset-password", (req, res) => {
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword)
        return res.redirect("back");
    
    Student.findById(req.user._id, (err, foundStudent) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err)
                return res.redirect("back");
            
            foundStudent.pass = hash;
            foundStudent.save();
            return res.redirect("/login");
        });
    });

    Organisation.findById(req.user._id, (err, foundStudent) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err)
                return res.redirect("back");
            
            foundStudent.pass = hash;
            foundStudent.save();
            return res.redirect("/login");
        });
    });
    
});
module.exports = router;