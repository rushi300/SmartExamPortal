const express      = require("express");
const router       = express.Router();
const Student      = require("../models/student");
const Organisation = require("../models/organisation");
const Exam = require("../models/exam");
const email = require('../helpers/email');
const exam = require("../helpers/exam");
const student = require("../models/student");

router.get("/student-home/:id", (req, res) => {
    Student.findById(req.params.id).populate({
        path: "organisations",
        populate: {
            path: "exams_conducted"
        }
    }).exec((err, foundStudent) => { 
        if (err)
            return res.redirect("back");
        Exam.find({}, (err, foundExams) => {
            if (err)
                return res.redirect("back");
            var allExams = exam.updateExamStatus(foundExams); 
            return res.render("tempstudentHome", { exams: allExams, student: foundStudent });
        });
    });
});

router.get("/:student_id/myExams",(req,res)=>{
    Student.findById(req.params.student_id).populate("exams").exec((err,foundStudent)=>{
        if(err){
            console.error(err);
            res.redirect("back");
        }else{
            var registeredExams = foundStudent.exams;
            registeredExams = exam.updateExamStatus(registeredExams);
            res.render("tempRegisteredExams", { exams: registeredExams, user: req.user });
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

router.post("/unsubscribe/:clicked_exam_id",(req,res)=>{
    Exam.findById(req.params.clicked_exam_id, (err,foundExam)=>{
        if(err){
            res.redirect("back");
            console.error(err);
        }else{
            req.user.exams.pull(foundExam);
            foundExam.students_registered.pull(req.user);
            req.user.save();
            foundExam.save();
            res.redirect("/student-home/"+ req.user._id);
        }
    })
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

router.post("/leave-organisation", (req, res) => {
    Student.findById(req.user._id, (err, foundStudent) => {
        if (err)
            return res.redirect("back");
        
        Organisation.findOne({ joiningCode: req.body.joiningCode }, (err, foundOrganisation) => {
            if (err)
                return res.redirect("back");
            
            var organisationsArray = foundStudent.organisations;
            var index = organisationsArray.indexOf(foundOrganisation._id);
            organisationsArray.splice(index, 1);

            var studentsArray = foundOrganisation.students;
            index = studentsArray.indexOf(foundStudent._id);
            studentsArray.splice(index, 1);

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