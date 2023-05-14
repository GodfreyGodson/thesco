// const mongoose = require('mongoose');
// const Enrollment = require('./enrollment');
// const User = require('./user');

// const courseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   notes: { type: String },
//   image: { type: String },
//   subscribers: [
//     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    
//   ]
// });

// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;
/***************above */


const mongoose = require('mongoose');
const Enrollment = require('./enrollment');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  notes: { type: String },
  image: { type: String },
  enrollments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
    },
  ],
});

courseSchema.set('toObject', { virtuals: true });
courseSchema.set('toJSON', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
