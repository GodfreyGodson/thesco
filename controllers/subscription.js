// controllers/subscriptionController.js
const Enrollment = require('../models/enrollment');
const Subscription = require('../models/subscription');
const User = require('../models/user');

exports.updatePaymentStatus = async (req, res) => {
const { email } = req.params;
const { paymentStatus } = req.body;
try {
    const user = await User.findOne({ email });
    const enrollment = await Enrollment.findOne({ student: user._id }).populate('student');
    
if (!enrollment) {
throw new Error('Enrollment not found');
}
const subscription = await Subscription.findOne({ enrollment: enrollment._id });
console.log('enrollment:', enrollment);
console.log('subscription:', subscription);

if (!subscription) {
throw new Error('Subscription not found');
}
subscription.paymentStatus = paymentStatus;
await subscription.save();
res.send(subscription);
} catch (error) {
console.log(error);
res.status(500).send(error.message);
}
};