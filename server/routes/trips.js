import express from 'express';
import Trip from '../models/Trip.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// GET all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create trip
router.post('/', async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update trip
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE trip and its activities
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    // Also delete all activities associated with this trip
    await Activity.deleteMany({ tripId: req.params.id });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
