const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
    user_id: {
        type: String,
        maxlength: 30,
    },
    company_id: [
        String
    ],
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = { Bookmark };