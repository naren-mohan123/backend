const mongoose = require("mongoose");
const schema = mongoose.Schema;

var commentSchema = new schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    dish : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Dish"
    }
}, {
    timestamps: true
});

var Comments = mongoose.model("Comment",commentSchema);

module.exports = Comments;