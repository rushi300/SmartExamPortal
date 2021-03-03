const mongoose              = require("mongoose");

const ExamSchema = new mongoose.Schema({
    name               : String,
    description        : String,
    link               : String,
    startTime          : Date,
    endTime            : Date,
    duration           : String,
    medium             : String,
    isPublic           : Boolean,
    students_registered: [{
        type           : mongoose.Schema.Types.ObjectId,
        ref            : "Student"
    }],
    organizer          : String,
    isLive             : Boolean,
    isUpcoming         : Boolean,
    IsCompleted        : Boolean
});

module.exports = mongoose.model("Exam", ExamSchema);