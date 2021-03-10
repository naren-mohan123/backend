var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const user = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        requied : true
    },
    admin : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model("user",user);