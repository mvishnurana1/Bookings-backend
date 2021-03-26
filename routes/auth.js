const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Log in user
// @access  Public
router.get('/', (req, res) => {
    res.send('Log in a user...');
});

// @route   POST api/auth
// @desc    Authenticate user and token
// @access  Public
router.post('/', (req, res) => {
    res.send('Log in user');
});

module.exports = router;
