const express      = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student      = require("../models/student");
const Organisation = require("../models/organisation");
const Exam         = require("../models/exam")  

router.get('/exam/new', (req,res)=>{
    res.render("exam");
});

router.post('/exam/new', (req,res)=>{
    var newExam = new Exam({
        name : req.body.name,
        description : req.body.description,
        link : req.body.link,
        date : req.body.date,
        startTime : req.body.startTime,
        endTime : req.body.endTime,
        isPublic : req.body.isPublic
    })
    var exam = Exam.create(newExam, (err,newlyCreated)=>{
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
        }
    })

    Organisation.findById(req.user.id, (err, foundOrganisation) => {
        if (err) {
            // 
        }
        else {
            foundOrganisation.exams_conducted.push(exam);
            console.log(foundOrganisation.exams_conducted);
        }
    })
});


// router.get("/exam/", (req,res)=>{
//     Exam.find({},(err,foundExam)=>{
//         if(err){
//             console.error(err);
//         }else{
//             res.send(foundExam);
//         }
//     })
// })

router.get("/:organisation_id/exams", (req,res)=>{
    Organisation.find({}, (err,allOrganisations)=>{
        if(err){
            console.error(err);
        }else{
        }
    })
});



// router.get('/newExam',(req,res)=>{
//     res.render
// })
module.exports = router;