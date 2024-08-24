const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Outfit = require('../models/Outfit');
const { getWeatherData } = require("../services/weatherService");
const auth = require('../middleware/auth');

router.get('/recommendations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const location = user.location;
        const preferences = user.preferences;

        const weatherData = await getWeatherData(location);

        let outfitCriteria = {};

        if (weatherData.main.temp < 15) {
            outfitCriteria.temperatureRange = 'cold';
        } else {
            outfitCriteria.temperatureRange = 'warm';
        }

        if (weatherData.weather[0].main === 'Rain') {
            outfitCriteria.weatherType = 'rainy';
        } else if (weatherData.weather[0].main === 'Clear') {
            outfitCriteria.weatherType = 'sunny';
        } else {
            outfitCriteria.weatherType = 'cloudy';
        }

        const outfits = await Outfit.find(outfitCriteria);

        const recommendedOutfits = outfits.filter(outfit => outfit.temperatureRange === preferences);

        res.json(recommendedOutfits);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/signup', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, location, preferences } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists'} );
        }

        user = new User({
            username, 
            email,
            password,
            location,
            preferences
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json( { message: 'Server error' } );
    }
});

router.get('/weather/:location', async (req, res) => {
    try {
        const weatherData = await(getWeatherData(req.params.location));
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch weather data '});
    }
});

module.exports = router;