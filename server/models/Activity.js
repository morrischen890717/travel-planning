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
    enum: ['sightseeing', 'food', 'transport', 'shopping'],
    default: 'sightseeing'
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
  }
}, {
  timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
