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
    startTime: {
        type: Date,
        require: true,
    },
    endTime: {
        type: Date,
        require: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    payment: {
        type: String,
        default: 'in-shop',
    },
    bookingConfirmationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('booking', BookingSchema);
