const express      = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student         = require("../models/student");
const Organisation         = require("../models/organisation");

// Login Routes
router.get("/login", (req, res) => {
    res.render('login');
});

router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
    req.logIn(user, (err) => {
        if (err) {
            console.log(err);
            return next(err);
        }
      return res.send("This is Students page");
    });
  })(req, res, next);
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
        fullName : firstName + " " + lastName,
        dob: re.body.dob,
        gender: req.body.gender,
        city : req.body.city
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
        email: req.body.email
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