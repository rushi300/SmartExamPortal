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
    var startTime = moment(req.body.startTime, "H:mm");
    var endTime = moment(req.body.endTime, "H:mm");
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) % 60;
    var isPublic = false;
    if (req.body.isPrivate == "on")
        isPublic = false;
    else
        isPublic = true;
    var newExam = new Exam({
        name: req.body.name,
        description: req.body.description,
        link: req.body.link,
        date: req.body.date,
        medium: req.body.medium,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        duration: hours + " hours " + minutes + " minutes",
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