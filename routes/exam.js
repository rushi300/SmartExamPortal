require('dotenv/config');
const express = require("express");
const router       = express.Router();
const Organisation = require("../models/organisation");
const moment = require('moment');
const Student = require("../models/student");
const Exam = require("../models/exam");

router.get('/exam/new/:id', (req,res)=>{
    Organisation.findById(req.params.id, (err, foundOrganisation) => {
        res.render("exam",{id: req.params.id, user: foundOrganisation});
    });
});

router.post('/exam/new/:id', (req, res) => {
    var mydate1 = req.body.date1.split("-").reverse().join("-");
    var reversedSting1 = moment(mydate1, "DD MM, YYYY").toLocaleString();
    reversedSting1 = reversedSting1.slice(4,16);
    var startTime = new Date(reversedSting1 + " " + req.body.startTime);
    
    var mydate2 = req.body.date2.split("-").reverse().join("-");
    var reversedSting2 = moment(mydate2, "DD MM, YYYY").toLocaleString();
    reversedSting2 = reversedSting2.slice(4,16);
    var endTime = new Date(reversedSting2 + " " + req.body.endTime);
    
    var diff = endTime - startTime;
    var min = diff / 60000;
    var hours = parseInt(min / 60);
    var mins = min % 60;

    var duration;
    if (hours == 0) {
        if (mins == 1)
            duration = "1 min";
        else
            duration = mins + " mins";
    }
    else if (hours == 1) {
        if (mins == 0)
            duration = "1 hr";
        else if (mins == 1)
            duration = "1 hr 1 min";
        else
            duration = "1 hr " + mins + " mins";
    }
    else
        duration = hours + " hrs " + mins + " mins";
    
    var isPublic = false;
    if (req.body.isPrivate == "on")
        isPublic = false;
    else
        isPublic = true;
    
    const currentTime = new Date();
    let isCompleted = false;
    let isLive = false;
    let isUpcoming = false;
    if (currentTime > startTime && currentTime < endTime) {
        isCompleted = false;
        isLive = true;
        isUpcoming = false;
    }
    else if (currentTime > startTime && currentTime > endTime) {
        isCompleted = true;
        isLive = false;
        isUpcoming = false;
    }
    else if (currentTime < startTime) {
        isCompleted = false;
        isLive = true;
        isUpcoming = true;
    }

    var newExam = new Exam({
        name: req.body.name,
        description: req.body.description,
        link: req.body.link,
        medium: req.body.medium,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        isPublic: isPublic,
        organizer: req.body.Name,
        isCompleted: isCompleted,
        isLive: isLive,
        isUpcoming: isUpcoming
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
            // console.log(req.user);
            Student.findById(req.params.student_id,(err,foundStudent)=>{
                if(err){
                    console.error(err)
                }else{
                    // console.log("foundStudent: " + foundStudent);
                    res.render("viewExam", { exam: foundExam , user: foundStudent});
                }
            })
        }
    })
});

module.exports = router;