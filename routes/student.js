const express      = require("express");
const router       = express.Router();
const Student      = require("../models/student");
const Organisation = require("../models/organisation");
const Exam = require("../models/exam");
const email = require('./email');

router.get("/student-home/:id", (req, res) => {
    var foundExam;
    Exam.find({}, (err, foundExams) => {
        if (err)
            return res.redirect("back");
        foundExam = foundExams;
    });

    Student.findById(req.params.id).populate({
        path: "organisations",
        populate: {
            path: "exams_conducted"
        }
    }).exec((err, foundStudent) => { 
        if (err)
            return res.redirect("back");
        res.render("studentHome", { exams: foundExam, student: foundStudent });
    });
});

router.get("/:student_id/myExams",(req,res)=>{
    Student.findById(req.params.student_id).populate("exams").exec((err,foundStudent)=>{
        if(err){
            console.error(err);
            res.redirect("back");
        }else{
            res.render("myExams", { exams: foundStudent.exams, user: req.user });
        }
    })
});

router.post("/subscribe/:clicked_exam_id", (req, res) => {
    Exam.findById(req.params.clicked_exam_id, async (err,foundExam)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            var subjectOfEmail = "Subscribed to exam";
            var textToBeSentInEmail = "You have successfully subscribed to exam";
            email.sendEmail(req.user.email, subjectOfEmail, textToBeSentInEmail);
   
            req.user.exams.push(foundExam);
            foundExam.students_registered.push(req.user._id);
            req.user.save();
            foundExam.save();

            res.redirect("/student-home/" + req.user._id );
        }   
    });
});

router.post("/join-organisation", (req, res) => {
    Student.findById(req.user._id, (err, foundStudent) => {
        if (err)
            return res.redirect("back");

        Organisation.findOne({ joiningCode: req.body.joiningCode }, (err, foundOrganisation) => {
            if (err)
                return res.redirect("back");
    
            foundStudent.organisations.push(foundOrganisation._id);
            foundOrganisation.students.push(foundStudent._id);
            foundStudent.save();
            foundOrganisation.save();
            return res.redirect('/student-home/' + req.user._id);
        });
    });
});

router.get("/show-registered-organisations", (req, res) => {

    Student.findById(req.user._id).populate("organisations").exec((err, foundStudent) => {
        if (err)
            return res.redirect("back");
        
        var listOfRegisteredOrganisations = foundStudent.organisations;

        res.render("joinOrganisation", {listOfRegisteredOrganisations: listOfRegisteredOrganisations, user: req.user});
    });
});

module.exports = router;