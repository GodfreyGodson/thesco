const mongoose = require('mongoose');

const examCategorySchema = new mongoose.Schema({
  examCategory: {
    type: String,
    required: true
  },
  examTime: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isPaid: {
    type: String,
    enum: ['Free Quize', 'Paid Quize'],
    required: true,
    default: 'Free Quize'
  },
  level:{

    type: String,
    required: true

  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result'
  }],
  

});

const ExamCategory = mongoose.model('ExamCategory', examCategorySchema);

module.exports = ExamCategory;
