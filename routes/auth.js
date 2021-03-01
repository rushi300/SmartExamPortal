require('dotenv/config');
const express = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student         = require("../models/student");
const Organisation = require("../models/organisation");
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

router.get("/login", (req, res) => {
    res.render('login');
});

router.post('/login', 
    passport.authenticate("local", { failureRedirect: '/login' }), (req, res) => {
        if (req.user.isStudent) {
            res.redirect("/student-home/" + req.user._id);
        }
        if (req.user.isOrganisation) {
            res.redirect("/organisation-home/" + req.user._id);
        }
    });

router.get("/logout", (req, res) => {
    req.logOut();
    return res.redirect("/");
});

router.get("/student_register", (req, res) => {
    res.render("studentRegister");
});

router.post("/student_register", (req, res) => {
    var saltRounds = 8;
    var passwordHash;
    bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
        passwordHash = hash;
        var newStudent = new Student({
            email: req.body.email,
            firstName: req.body.firstName,
            passwordHash: passwordHash,
            middleName : req.body.middleName,
            lastName : req.body.lastName,
            fullName : req.body.firstName + " " + req.body.middleName + " " + req.body.lastName,
            dob: req.body.dob,
            gender: req.body.gender,
            city: req.body.city,
            isOrganisation: false,
            isStudent: true
        });
        Student.create(newStudent, (err, createdStudent) => {
            if (err) {
                return res.redirect('back');
            }
            return res.redirect("/login");
        });
    });
});

router.get("/organisation_register", (req, res) => {
    res.render("organisationRegister");
});

router.post("/organisation_register", (req, res) => { 
    var saltRounds = 8;
    var passwordHash;
    var joiningCode = randomString.generate(6);

    bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
        passwordHash = hash;
        var newOrganisation = new Organisation({
            email: req.body.email,
            passwordHash: passwordHash,
            isOrganisation: true,
            isStudent: false,
            joiningCode: joiningCode,
            Name: req.body.Name,
            websiteLink: req.body.websiteLink
        });   
        Organisation.create(newOrganisation, async (err, organisationCreated) => {
            if (err) {
                res.send("errrorrrrrrrrrrrr!");
            }
            else {
                var transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "parthshah1936@gmail.com",
                        pass: process.env.password,
                    },
                });
                await transporter.sendMail({
                    from: "parthshah1936@gmail.com",
                    to: organisationCreated.email,
                    subject: "Your Unique joining code",
                    text:  "Your Unique joining code is " + joiningCode + "\nShare this code with the students to join your organisation."
                });
                transporter.close();
                res.redirect("/login");
            }
        });
    });
});

module.exports = router