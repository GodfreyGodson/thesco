const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  exam: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  opt1: {
    type: String,
    required: true
  },
  opt2: {
    type: String,
    required: true
  },
  opt3: {
    type: String,
    required: true
  },
  opt4: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  userAnswer:{
    type:String
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
