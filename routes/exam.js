require('dotenv/config');
const express = require("express");
const router       = express.Router();
const Organisation = require("../models/organisation");
const moment = require('moment');

const Exam = require("../models/exam");

router.get('/exam/new/:id', (req,res)=>{
    Organisation.findById(req.params.id, (err, foundOrganisation) => {
        res.render("exam",{id: req.params.id, user: foundOrganisation});
    });
});

router.post('/exam/new/:id', (req, res) => {
    var mydate1 = req.body.date.split("-").reverse().join("-");
    console.log("mydate1: "+ mydate1)
    var reversedSting1 = moment(mydate1, "DD MM, YYYY").toLocaleString();
    reversedSting1 = reversedSting1.slice(4,16);
    console.log(reversedSting1);
    var startTime = new Date(reversedSting1 + " " + req.body.startTime);
    
    var mydate2 = req.body.date.split("-").reverse().join("-");
    console.log("mydate2: "+ mydate2)
    var reversedSting2 = moment(mydate2, "DD MM, YYYY").toLocaleString();
    reversedSting2 = reversedSting2.slice(4,16);
    console.log(reversedSting2);
    var endTime = new Date(reversedSting2 + " " + req.body.endTime);
    var diff = endTime - startTime;
    var min = diff / 60000;
    var hours = parseInt(min / 60);
    var mins = min % 60;
    console.log("endtime: " + endTime);
    console.log("startTime: " + startTime);
    console.log(hours + " hours and " + mins + " minutes");
    var date = new Date();
    if (date > endTime)
        console.log("past exam");
    if (date >= startTime && date <= endTime)
        console.log("live exam");
    if (date < startTime)
        console.log("upcoming exam");

    var isPublic = false;
    if (req.body.isPrivate == "on")
        isPublic = false;
    else
        isPublic = true;
    var newExam = new Exam({
        name: req.body.name,
        description: req.body.description,
        link: req.body.link,
        medium: req.body.medium,
        startTime: startTime,
        endTime: endTime,
        duration: hours + " hours " + mins + " minutes",
        isPublic: isPublic,
        organizer: req.body.Name
    });

    Exam.create(newExam, (err,newlyCreated)=>{
        if(err){
            return res.redirect("back");
        }else{
            Organisation.findById(req.params.id, (err, foundOrganisation) => {
                if (err) {
                    return res.redirect("back");
                }
                else {
                    foundOrganisation.exams_conducted.push(newlyCreated._id);
                    foundOrganisation.save((err)=>{
                        return res.redirect("/organisation-home/" + req.params.id );
                    });
                }
            })
        }
    })

});

router.get("/exam/:id/:student_id", function (req, res) {
    Exam.findById(req.params.id,(err,foundExam)=>{
        if(err){
            return res.redirect("back");
        } else {
            res.render("viewExam", { exam: foundExam , id: req.params.student_id});
        }
    })
});

module.exports = router;