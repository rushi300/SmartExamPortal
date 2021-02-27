const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const ExamSchema = new mongoose.Schema({
    name               : String,
    description        : String,
    link               : String,
    date               : String,
    startTime          : String,
    endTime: String,
    duration: String,
    medium             : String,
    isPublic           : Boolean,
    students_registered: [{
        type           : mongoose.Schema.Types.ObjectId,
        ref            : "Student"
    }],
    organizer: String
});

module.exports = mongoose.model("Exam", ExamSchema);