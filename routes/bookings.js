const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const user = require('../models/Users');
const Bookings = require('../models/Booking');

// @route   POST api/bookings
// @desc    Register a bookings takes a location and timing
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('startTime', 'Please pick a specific START time for booking')
                .not()
                .isEmpty(),
            check('endTime', 'Please pick a specific END time for booking')
                .not()
                .isEmpty(),
            check('location', 'Please choose a booking location in facility')
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            location,
            startTime,
            endTime,
            phone,
            email,
            payment,
        } = req.body;

        try {
            const newBooking = new Bookings({
                user: req.user.id,
                location,
                startTime,
                endTime,
                phone,
                payment,
                email,
            });

            const booking = await newBooking.save();
            res.json(booking);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/bookings
// desc    1. Get all bookings returns timing and location only (for unauthenticated user)
// Check middleware for user:
//         1. Get all bookings for specific user and others.
// Check middleware for Admin:
//         1. Get all the bookings with information about who has booked it etc.
// @access  Public
// The goal of endpoint is to only show bookings of future and nothing from past
// so we want less than to
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Bookings.find({
            // endTime: { $gte: new Date() },
            startTime: { $lte: new Date() },
        }).sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   Update api/bookings
// desc     Update any booking
// Check middleware for [user to own before updating]/admin and check for collision.
// @access  Private
router.put('/:id', (req, res) => {
    res.send('Update booking...');
});

// @route   Delete api/bookings
// desc     Check middleware for [user to own before deleting]/admin.
// @access  Private (user/admin)
router.delete('/:id', (req, res) => {
    res.send('Delete bookings');
});

module.exports = router;
