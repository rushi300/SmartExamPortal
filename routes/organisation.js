const express      = require("express");
const router       = express.Router();
const passport     = require("passport");
const Student      = require("../models/student");
const Organisation = require("../models/organisation");
const Exam         = require("../models/exam");
const middleware   =  require("../middleware");


router.get("/organisation-home/:id", async (req, res) => {
    Organisation.findById(req.params.id).populate("exams_conducted").exec((err, foundOrganisation) => {
        if (err) {
            return res.redirect("back");
        }
        var array = foundOrganisation.exams_conducted;
        res.render("organisationHome", { array: array, user: foundOrganisation });
    });
});

module.exports = router;