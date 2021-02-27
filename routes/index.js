const express      = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student         = require("../models/student");
const Organisation = require("../models/organisation");
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

// Login Routes
router.get("/login", (req, res) => {
    res.render('login');
});

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
        if (req.user.isStudent) {
            Student.findById(req.params.id, (err, student) => {
                if (err) {
                    return res.redirect('/login');
                }
                else {
                    res.redirect("/student-home/" + req.user.id);
                }
            });
        }
        if (req.user.isOrganisation) {
            Organisation.findById(req.params.id, (err, organisation) => {
                if (err) {
                    return res.redirect('/login');
                }
                else {
                    res.redirect("/organisation-home/" + req.user.id);
                }
            });
        }
    });

router.get("/logout", (req, res) => {
    req.logOut();
    return res.send("logged out successfully");
});


// Student Register

router.get("/student_register", (req, res) => {
    res.render("studentRegister");
});

router.post("/student_register", (req, res) => {
    var newStudent = new Student({
        email: req.body.email,
        firstName : req.body.firstName,
        middleName : req.body.middleName,
        lastName : req.body.lastName,
        fullName : req.body.firstName + " " + req.body.middleName + " " + req.body.lastName,
        dob: req.body.dob,
        gender: req.body.gender,
        city: req.body.city,
        isOrganisation: false,
        isStudent: true
    });

    Student.register(newStudent, req.body.password, (err, studentCreated) => {
        if (err) {
            console.log(err);
            res.send("errrorrrrrrrrrrrr!");
        }
        else {
            console.log(studentCreated);
            res.redirect("/login");
        }
    });
});

// Organisation Register

router.get("/organisation_register", (req, res) => {
    res.render("organisationRegister");
});

router.post("/organisation_register", (req, res) => { 
    var joiningCode = randomString.generate(6);
    var newOrganisation = new Organisation({
        email: req.body.email,
        isOrganisation: true,
        isStudent: false,
        joiningCode: joiningCode
    });

    Organisation.register(newOrganisation, req.body.password,async (err, organisationCreated) => {
        if (err) {
            console.log(err);
            res.send("errrorrrrrrrrrrrr!");
        }
        else {
            var transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "parthshah1936@gmail.com",
                    pass: "adgzcbqet19",
                },
            });
            await transporter.sendMail({
                from: "parthshah1936@gmail.com",
                to: organisationCreated.email,
                subject: "Your Unique joining code",
                text:  "Your Unique joining code is " + joiningCode + "\nShare this code with the students to join your organisation."
            });
            transporter.close();

            console.log(organisationCreated);
            res.redirect("/login");
        }
    });
});

router.post("/join-organisation", (req, res) => {
    Student.findById(req.user._id, (err, foundStudent) => {
        if (err)
            return res.redirect("back");
        
        Organisation.findOne({ joiningCode: req.body.joiningCode }, (err, foundOrganisation) => {
            if (err)
                return res.redirect("back");
            foundStudent.organisations.push(foundOrganisation._id);
            foundOrganisation.students.push(foundStudent._id);
            foundStudent.save();
            foundOrganisation.save();
            return res.redirect('/student-home/' + req.user._id);
        });
    });
});

module.exports = router