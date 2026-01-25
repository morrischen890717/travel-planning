import express from 'express';
import Activity from '../models/Activity.js';

const router = express.Router();

// GET activities by tripId
router.get('/', async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) {
      return res.status(400).json({ error: 'tripId is required' });
    }
    const activities = await Activity.find({ tripId }).sort({ dayIndex: 1, time: 1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create activity
router.post('/', async (req, res) => {
  try {
    const activity = new Activity(req.body);
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update activity
router.put('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
