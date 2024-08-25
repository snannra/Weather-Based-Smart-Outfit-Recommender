const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Outfit = require('../models/Outfit');
const { getWeatherData } = require("../services/weatherService");
const auth = require('../middleware/auth');

router.post('/create-basic-outfits', async (req, res) => {
    const outfits = [
        {
            outfitName: 'Sunny Day Outfit',
            temperatureRange: 'warm',
            weatherType: 'sunny',
            items: ['sunglasses', 'shorts', 't-shirt', 'sandals']
        },
        {
            outfitName: 'Cloudy Day Outfit',
            temperatureRange: 'warm',
            weatherType: 'cloudy',
            items: ['light jacket', 'jeans', 'sneakers']
        },
        {
            outfitName: 'Rainy Day Outfit',
            temperatureRange: 'warm',
            weatherType: 'rainy',
            items: ['raincoat', 'umbrella', 'waterproof boots']
        },
        {
            outfitName: 'Snowy Day Outfit',
            temperatureRange: 'cold',
            weatherType: 'snowy',
            items: ['winter coat', 'scarf', 'gloves', 'boots']
        },
        {
            outfitName: 'Misty Day Outfit',
            temperatureRange: 'cold',
            weatherType: 'misty',
            items: ['hoodie', 'jeans', 'sneakers', 'beanie']
        }
    ];

    try {
        await Outfit.insertMany(outfits);
        res.status(201).json({ message: 'Basic outfits created successfully!' });
    } catch (error) {
        console.error('Error creating outfits:', error);
        res.status(500).json({ message: 'Failed to create outfits' });
    }
});


router.get('/recommendations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const location = user.location;
        const preferences = user.preferences;

        const weatherData = await getWeatherData(location);

        let outfitCriteria = {};

        // Determine temperature range
        if (weatherData.main.temp < 15) {
            outfitCriteria.temperatureRange = 'cold';
        } else {
            outfitCriteria.temperatureRange = 'warm';
        }

        // Map weather descriptions to weather types
        const weatherDescription = weatherData.weather[0].description;

        const weatherTypeMapping = {
            'clear sky': 'sunny',
            'few clouds': 'cloudy',
            'scattered clouds': 'cloudy',
            'broken clouds': 'cloudy',
            'shower rain': 'rainy',
            'rain': 'rainy',
            'thunderstorm': 'rainy',
            'snow': 'snowy',
            'mist': 'misty',
        };

        outfitCriteria.weatherType = weatherTypeMapping[weatherDescription] || 'default'; 

        const outfits = await Outfit.find(outfitCriteria);

        const recommendedOutfits = outfits;

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