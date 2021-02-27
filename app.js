const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var Student = require('./models/student');
var Organisation = require('./models/organisation');

var indexRoutes = require("./routes/index");

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

// passport.use(Organisation.createStrategy());
// passport.serializeUser(Organisation.serializeUser());
// passport.deserializeUser(Organisation.deserializeUser());


app.use(indexRoutes);


app.get("/", (req,res) => {
    res.redirect("/login")
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("The Server is listening on " + 3000);
});

