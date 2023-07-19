const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
