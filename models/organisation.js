const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const OrganisationSchema = new mongoose.Schema({
    Name            : String,
    email           : {type: String, unique: true , required: true},
    password        : String,
    websiteLink     : String,
    students        : [{
        type        : mongoose.Schema.Types.ObjectId,
        ref         : "Student"
    }],
    exams_conducted : [{
        type        : mongoose.Schema.Types.ObjectId,
        ref         : "Exam"
    }],
    isStudent: Boolean,
    isOrganisation: Boolean,
    joiningCode: String
});


OrganisationSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("Organisation", OrganisationSchema);