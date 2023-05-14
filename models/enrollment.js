const mongoose = require('mongoose');
//const Subscription = require('./subscription');
//const User = require('./user');
const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  isPaid: { type: Boolean, default: false },
});



// enrollmentSchema.post('save', async function () {
//   try {
//     const subscription = new Subscription({ enrollment: this._id });
//     await subscription.save();
//   } catch (error) {
//     console.log(error);
//   }
// });
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports =  Enrollment;





// const enrollmentSchema = new mongoose.Schema({
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Course',
//       required: true,
//     },
//     isPaid: {
//       type: Boolean,
//       default: false,
//     },
//     isUnlocked: {
//       type: Boolean,
//       default: false,
//     },
//   });
  
//   enrollmentSchema.pre('save', function (next) {
//     if (this.isPaid) {
//       this.isUnlocked = true;
//     }
//     next();
//   });

