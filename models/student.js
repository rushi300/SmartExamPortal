const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const StudentSchema = new mongoose.Schema({
    firstName     : String,
    middleName    : String,
    lastName      : String,
    email         : {type: String, unique: true , required: true},
    pass          : String,
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

StudentSchema.methods.validPassword = function (password) {
    console.log(password);
    console.log(this.password);
    if (password === this.password) {
    return true; 
  } else {
    return false;
  }
};

StudentSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("Student", StudentSchema);