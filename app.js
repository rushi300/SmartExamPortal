const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const moment = require('moment');

var Student = require('./models/student');
var Organisation = require('./models/organisation');

var indexRoutes = require("./routes/index");
var examRoutes = require("./routes/exam");

mongoose.connect("mongodb://localhost/test1", 
                    {useNewUrlParser: true, 
                    useUnifiedTopology: true, 
                    useCreateIndex: true
                });
                    
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended:false}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (username, password, done) {
    await Student.findOne({ email: username }, async (err, user) => {
      if (err) {
        console.log(err);
      }
      if (user) {
        user.isStudent = true;
        user.isOrganisation = false;
        user.save();
        passport.serializeUser(Student.serializeUser());
        passport.deserializeUser(Student.deserializeUser());
        return done(err, user);
      }
    });

    await Organisation.findOne({ email: username }, (err, user) => {
      if (err) {
        console.log(err);
      }
      if (user) {
        user.isStudent = false;
        user.isOrganisation = true;
        user.save();
        passport.serializeUser(Organisation.serializeUser());
        passport.deserializeUser(Organisation.deserializeUser());
        return done(err, user);
      }
    });
  }));

app.use(indexRoutes);
app.use(examRoutes);

app.get("/", (req,res) => {
    res.redirect("/login")
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("The Server is listening on " + 3000);
});

