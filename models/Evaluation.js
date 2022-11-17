const mongoose = require('mongoose');

const evaluationSchema = mongoose.Schema({
    project_id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    score_eval: [{
        label: String,
        questions: [{
            id: String,
            score: Number
        }],
        avg_score: Number
    }],
    comment_eval: {
        type: String,
        required: true
    },
});

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
module.exports = { Evaluation };