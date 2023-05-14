// Subscription model
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;