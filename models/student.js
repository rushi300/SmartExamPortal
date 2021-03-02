const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const StudentSchema = new mongoose.Schema({
    firstName     : String,
    middleName    : String,
    lastName      : String,
    email: { type: String, unique: true, required: true },
    passwordHash: String,
    dob           : String,
    gender        : String,
    organisations : [{
        type      : mongoose.Schema.Types.ObjectId,
        ref       : "Organisation"
    }],
    exams         : [{
        type      : mongoose.Schema.Types.ObjectId,
        ref       : "Exam"
    }],
    city: String,
    isStudent: Boolean,
    isOrganisation: Boolean
});

StudentSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("Student", StudentSchema);