const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// const user = require('../models/Users');
// const bookings = require('../models/Booking');

// @route   POST api/bookings
// @desc    Register a bookings takes a location and timing
// @access  Public
router.post(
    '/',
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
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.send('Register a new booking...');
    }
);

// @route   GET api/bookings
// desc    1. Get all bookings returns timing and location only
// Check middleware for user:
//         1. Get all bookings for specific user and others.
// Check middleware for Admin:
//         1. Get all the bookings with information about who has booked it etc.
// @access  Public
router.get('/', (req, res) => {
    res.json({ bookings: [{ location: 'xyz' }, { location: 'abc' }] });
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
