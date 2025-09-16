import express from 'express';
import Surgery from "../models/Surgery.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const surgeries = await Surgery.find({ status: 'scheduled' });
        res.json(surgeries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const surgery = new Surgery(req.body);
        await surgery.save();
        res.status(201).json({ message: 'Surgery created!', surgery });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const surgery = await Surgery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!surgery) {
            return res.status(404).json({ error: 'Surgery not found' });
        }
        res.json({ message: 'Surgery updated', surgery });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id/cancel', async (req, res) => {
    try {
        const surgery = await Surgery.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );
        if (!surgery) {
            return res.status(404).json({ error: 'Surgery not found' });
        }
        res.json({ message: 'Surgery cancelled', surgery });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const surgery = await Surgery.findById(req.params.id);
        if (!surgery) {
            return res.status(404).json({ error: 'Surgery not found' });
        }
        res.json(surgery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const surgeries = await Surgery.find({
            dateTime: { $gte: new Date() }, 
            status: { $in: ['scheduled'] } 
        }).sort({ dateTime: 1 }); 
        res.json(surgeries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;