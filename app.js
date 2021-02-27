const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');

var Student = require('./models/student');
var Organisation = require('./models/organisation');

var indexRoutes = require("./routes/index");
var examRoutes = require("./routes/exam");

mongoose.connect("mongodb://localhost/testing", 
                    {useNewUrlParser: true, 
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

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
      Student.findOneAndUpdate({ email: username }, {$set : {isStudent: true, isOrganisation: false}},  (err, user) => {
          if (err)
          {
            console.log(err);    
          }
          if (user)
          {
            passport.serializeUser(Student.serializeUser());
            passport.deserializeUser(Student.deserializeUser());
            return done(err, user);
          }
      });

      Organisation.findOneAndUpdate({ email: username },{$set : {isStudent: false, isOrganisation: true}},(err, user) => {
          if (err)
          {
            console.log(err);
          }
          if (user)
          {
            passport.serializeUser(Organisation.serializeUser());
            passport.deserializeUser(Organisation.deserializeUser());
            return done(err, user);
          }
      });
    }
));


app.use(indexRoutes);
app.use(examRoutes);

app.get("/", (req,res) => {
    res.redirect("/login")
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("The Server is listening on " + 3000);
});

