const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const Users = require('../models/Users');
const router = express.Router();

// @route   GET api/users
// @desc    Log in user
// @access  private
router.get('/', (req, res) => {
    res.send('Log in a user...');
});

// @route   POST api/auth
// @desc    Authenticate user and token
// @access  Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await Users.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentails' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentails' });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 3600000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;
