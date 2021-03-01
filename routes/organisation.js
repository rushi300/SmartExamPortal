const express      = require("express");
const router       = express.Router();
const Organisation = require("../models/organisation");

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