const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const email = require('./helpers/email');

var Student = require('./models/student');
var Organisation = require('./models/organisation');

var authRoutes = require("./routes/auth");
var examRoutes = require("./routes/exam");
var studentRoutes = require("./routes/student");
var organisationRoutes = require("./routes/organisation");
var forgetPasswordRoutes = require("./routes/forgetPassword");

mongoose.connect("mongodb://localhost/test4", 
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

setInterval(() => {
  Student.find({}).populate('exams').exec().then((allStudents) => {
    allStudents.forEach((student) => {
      const subscribedExams = student.exams;
      subscribedExams.forEach((exam) => {
        if (exam.isUpcoming) {
          const currentTime = new Date(Date.now());
          const examStartTime = new Date(exam.startTime);
          const milliseconds = Math.abs(examStartTime - currentTime);
          const hours = milliseconds / (60 * 60 * 1000);
          if (hours > 23.98 && hours < 24.00)
            email.sendEmail(student.email, `Exam Reminder`, `Your exam ${exam.name} conducted by ${exam.organizer} is about to begin in 24 hours\nThe link to exam is ${exam.link}\nAll the best for your exam!`);
        }
      });
    });
  });
}, 60000);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("The Server is listening on " + 3000);
});

// public/private filter
// smart exam portal email