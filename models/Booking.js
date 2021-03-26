const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    location: {
        type: String,
        required: true,
    },
    bookingSchedule: {
        type: Date,
        require: true,
    },
    bookingConfirmationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('booking', BookingSchema);
