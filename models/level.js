const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  levelName: {
    type: String,
    required: true
  },
  examCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCategory'
  }]
 
});

const Level = mongoose.model('Level', levelSchema);

module.exports = Level;
