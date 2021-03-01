const express      = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student      = require("../models/student");
const Organisation = require("../models/organisation");
const Exam = require("../models/exam");
var middleware     =  require("../middleware")

router.post("/join-organisation", (req, res) => {
    console.log("in join-organisation post route:")
    console.log(req.user._id);
    Student.findById(req.user._id, (err, foundStudent) => {
        if (err)
            return res.redirect("back");
        // console.log(req.body.joiningCode);
        Organisation.findOne({ joiningCode: req.body.joiningCode }, (err, foundOrganisation) => {
            if (err)
                return res.redirect("back");
            // console.log(foundOrganisation);
            foundStudent.organisations.push(foundOrganisation._id);
            foundOrganisation.students.push(foundStudent._id);
            foundStudent.save();
            foundOrganisation.save();
            return res.redirect('/student-home/' + foundStudent._id);
        });
    });
});

router.get("/show-registered-organisations", (req, res) => {
    console.log("in show-registered-organisation route:")
    console.log(req.user._id);
    Student.findById(req.user._id).populate("organisations").exec((err, foundStudent) => {
        if (err)
            return res.redirect("back");
        
        var listOfRegisteredOrganisations = foundStudent.organisations;

        res.render("joinOrganisation", {listOfRegisteredOrganisations: listOfRegisteredOrganisations, user: foundStudent._id});
    });
});

router.get("/student-home/:id", (req, res) => {
    console.log("in student-home/:id route:")
    console.log(req.user._id);
    Exam.find({}, (err, foundExam) => {
        if (err)
            return res.redirect("back");
        
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
});

router.post("/subscribe/:clicked_exam_id", middleware.isLoggedIn_student, (req, res) => {
    console.log("in subscribe/clicked_exam_id route:")
    console.log(req.user._id);
    Exam.findById(req.params.clicked_exam_id, async (err,foundExam)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            var transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "parthshah1936@gmail.com",
                    pass: "adgzcbqet19",
                },
            });
            await transporter.sendMail({
                from: "smartexamportal@gmail.com",
                to: req.user.email,
                subject: "Subscribed to exam",
                text:  "You have successfully subscribed to exam!"
            });
            transporter.close();

            req.user.exams.push(foundExam);
            foundExam.students_registered.push(req.user._id);
            req.user.save();
            foundExam.save();
            // console.log(req.user.exams);
            // console.log(foundExam.students_registered);
            res.redirect("/student-home/" + req.user._id );
        }   
    });
});

router.get("/:student_id/myExams", (req, res) => {
    console.log("in student_id/myExams route :")
    console.log(req.user._id);
    Student.findById(req.params.student_id).populate("exams").exec((err,foundStudent)=>{
        if(err){
            console.error(err);
            res.redirect("back");
        }else{
            res.render("myExams", { exams: foundStudent.exams, user: foundStudent });
        }
    })
});


module.exports = router;
