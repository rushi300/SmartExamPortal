const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

var Student = require('./models/student');
var Organisation = require('./models/organisation');

var authRoutes = require("./routes/auth");
var examRoutes = require("./routes/exam");
var studentRoutes = require("./routes/student");
var organisationRoutes = require("./routes/organisation");
var forgetPasswordRoutes = require("./routes/forgetPassword");

mongoose.connect("mongodb://localhost/test3", 
                    {useNewUrlParser: true, 
                    useUnifiedTopology: true, 
                    useCreateIndex: true
                });
                    
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended:false}));
app.use(require("express-session")({
    secret: "This is in testing",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
    Student.findOne({ email: email },(err, user) => {
      if (!err && user) {
        bcrypt.compare(password, user.passwordHash).then(function (result) {
          if (!result) {
            return done(null, false);
          }
          passport.serializeUser(function (user, done) {
            done(null, user._id);
          });
          passport.deserializeUser(function (id, done) {
            Student.findById(id, function (err, user) {
              return done(err, user);
            });
          });
          return done(null, user);
        });
      }
    });

    Organisation.findOne({ email: email }, (err,user) => {
      if (!err && user) {
        bcrypt.compare(password, user.passwordHash).then(function (result) {
          if (!result) {
            return done(null, false);
          }

          passport.serializeUser(function (user, done) {
            done(null, user._id);
          });

          passport.deserializeUser(function (id, done) {
            Organisation.findById(id, function (err, user) {
              return done(err, user);
            });
          });
          return done(null, user);
        });
      }
    });
}));

app.use(authRoutes);
app.use(examRoutes);
app.use(studentRoutes);
app.use(organisationRoutes);
app.use(forgetPasswordRoutes);

app.get("/", (req, res) => {
  res.redirect("/login")
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("The Server is listening on " + 3000);
});

