const express      = require("express");
const router       = express.Router();
const Organisation = require("../models/organisation");
const exam = require("../helpers/exam");

router.get("/organisation-home/:id", async (req, res) => {
    Organisation.findById(req.params.id).populate("exams_conducted").exec((err, foundOrganisation) => {
        if (err) {
            return res.redirect("back");
        }
        var conductedExamsByOrganisation = foundOrganisation.exams_conducted;
        conductedExamsByOrganisation = exam.updateExamStatus(conductedExamsByOrganisation);

        return res.render("organisationHome", { array: conductedExamsByOrganisation, user: foundOrganisation });
    });
});

module.exports = router;