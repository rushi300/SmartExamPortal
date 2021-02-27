const express      = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student         = require("../models/student");
const Organisation         = require("../models/organisation");

// Login Routes
router.get("/login", (req, res) => {
    res.render('login');
});

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
        console.log("current user object: ");
        console.log(req.user);
        console.log(req.params);
        if (req.user.isStudent) {
            Student.findById(req.params.id, (err, student) => {
                if (err) {
                    console.log(err);
                    return res.redirect('/login');
                }
                else {
                    console.log("inside else of student");
                    res.send('logged in via student');
                }
            });
        }
        if (req.user.isOrganisation) {
            Organisation.findById(req.params.id, (err, organisation) => {
                if (err) {
                    console.log(err);
                    return res.redirect('/login');
                }
                else {
                    console.log("inside else of organisation");
                    res.send('logged in via organisation');
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
    var newOrganisation = new Organisation({
        email: req.body.email,
        isOrganisation: true,
        isStudent: false
    });

    Organisation.register(newOrganisation, req.body.password, (err, organisationCreated) => {
        if (err) {
            console.log(err);
            res.send("errrorrrrrrrrrrrr!");
        }
        else {
            console.log(organisationCreated);
            res.redirect("/login");
        }
    });
});

module.exports = router