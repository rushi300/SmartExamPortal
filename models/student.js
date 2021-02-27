const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const StudentSchema = new mongoose.Schema({
    firstName : String,
    middleName: String,
    lastName  : String,
    email     : {type: String, unique: true , required: true},
    password  : String,
    dob       : String,
    gender    : String,
    Institute : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Institute"
    },
    city      : String,
});

StudentSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("Student", StudentSchema);