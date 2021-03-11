var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

const user = new Schema({
    admin : {
        type : Boolean,
        default : false
    }
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model("user",user);