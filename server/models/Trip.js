import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  participants: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
