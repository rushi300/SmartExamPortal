const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var Student = require('./models/student');


mongoose.connect("mongodb://localhost/testing", 
                    { useNewUrlParser: true, 
                    useUnifiedTopology: true, 
        useCreateIndex: true
    });
                    
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended:false}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(Student.createStrategy());
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

app.get("/login", (req, res) => {
    res.render('login');
});

app.post("/login", (req, res, next) => {
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
      return res.send("success");
    });
  })(req, res, next);
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    var newStudent = new Student({
        email: req.body.email
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

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("The Server is listening on " + 3000);
});

