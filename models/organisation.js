const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const OrganisationSchema = new mongoose.Schema({
    Name:String,
    email: {type: String, unique: true , required: true},
    password: String,
    websiteLink: String
});


OrganisationSchema.plugin(passportLocalMongoose,{
    usernameField : "email"
});

module.exports = mongoose.model("Organisation", OrganisationSchema);