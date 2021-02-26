var mongoose=require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var StudentSchema = new mongoose.Schema({
    email: String,
    password: String
});

StudentSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("Student", StudentSchema);