const express      = require("express");
const router       = express.Router();
const Organisation = require("../models/organisation");

router.get("/organisation-home/:id", async (req, res) => {
    Organisation.findById(req.params.id).populate("exams_conducted").exec((err, foundOrganisation) => {
        if (err) {
            return res.redirect("back");
        }
        var array = foundOrganisation.exams_conducted;
        array.forEach((exam) => {
            end = exam.endTime;
            start = exam.startTime;
            var currentDate = new Date();
            if (currentDate > exam.endTime) {
                exam.isUpcoming = false;
                exam.isLive = false;
                exam.isCompleted = true;
            }
            if (currentDate >= exam.startTime && currentDate <= exam.endTime) {
                exam.isUpcoming = false;
                exam.isLive = true;
                exam.isCompleted = false;
            }
            if (currentDate < exam.startTime) {
                exam.isUpcoming = true;
                exam.isLive = false;
                exam.isCompleted = false;
            }
        });
        res.render("organisationHome", { array: array, user: foundOrganisation });
    });
});

module.exports = router;