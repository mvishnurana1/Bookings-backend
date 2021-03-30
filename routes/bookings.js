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
router.put('/:id', auth, async (req, res) => {
    const {
        email,
        endTime,
        name,
        location,
        payment,
        phone,
        startTime,
    } = req.body;

    // Build new object
    const updatedBooking = {};

    if (email) updatedBooking.email = email;
    if (endTime) updatedBooking.endTime = endTime;
    if (location) updatedBooking.location = location;
    if (name) updatedBooking.name = name;
    if (phone) updatedBooking.phone = phone;
    if (payment) updatedBooking.payment = payment;
    if (startTime) updatedBooking.startTime = startTime;

    try {
        let booking = await Bookings.findById(req.params.id);

        if (!booking) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns the booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Authorised' });
        }

        booking = await Bookings.findByIdAndUpdate(
            req.params.id,
            { $set: updatedBooking },
            { new: true }
        );

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/bookings
// desc     Check middleware for [user to own before deleting]/admin.
// @access  Private (user/admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        let booking = await Bookings.findById(req.params.id);

        if (!booking) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns the booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Authorised' });
        }

        await Bookings.findByIdAndRemove(req.params.id);

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
