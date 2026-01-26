import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  cost: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['sightseeing', 'food', 'transport', 'shopping', 'other'],
    default: 'sightseeing'
  },
  currency: {
    type: String,
    enum: ['TWD', 'JPY', 'USD', 'EUR', 'CNY', 'KRW', 'GBP', 'THB', 'VND', 'HKD'],
    default: 'TWD'
  },
  notes: {
    type: String,
    default: ''
  },
  splitBy: [{
    type: String,
    trim: true
  }],
  dayIndex: {
    type: Number,
    default: -1
  },
  isExpenseOnly: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
