const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  exam: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  
  userAnswer: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  score:{
    type: Number,
    default: 0,  // set default value of score to 0
    validate: {
      validator: function() {
        return this.score === 0 || this.score === 1;  // validate score to be either 0 or 1
      },
      message: "Score should be either 0 or 1."
    }
  }
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
