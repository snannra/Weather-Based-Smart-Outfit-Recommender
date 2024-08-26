const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Outfit = require('../models/Outfit');
const { getWeatherData } = require("../services/weatherService");
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './uploads/',  
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single('imageFile');  

router.get('/outfits', auth, async (req, res) => {
    try {
        const currentWeatherMain = req.query.weatherMain;

        if (!currentWeatherMain) {
            return res.status(400).json({ message: 'Weather main parameter is missing' });
        }
        
        const outfits = await Outfit.find({
            user: req.user.id, 
            weatherType: currentWeatherMain.toLowerCase()
        });

        if (!outfits || outfits.length === 0) {
            console.log('No outfits found for the weather type:', currentWeatherMain);
            return res.json([]);
        }

        const outfitData = outfits.map(outfit => ({
            ...outfit.toObject(),
            imagePath: outfit.imagePath(),
        }));

        res.json(outfitData);
    } catch (error) {
        console.error('Error fetching outfits:', error);
        res.status(500).json({ message: 'Failed to fetch outfits' });
    }
});

router.post('/create-outfit', [auth, upload], async (req, res) => {
    const { outfitName, temperatureRange, weatherType, items } = req.body;

    try {
        const newOutfit = new Outfit({
            outfitName,
            temperatureRange,
            weatherType,
            items: items.split(',').map(item => item.trim()),
            user: req.user.id, 
        });

        if (req.file != null) {
            newOutfit.image = fs.readFileSync(req.file.path);
            newOutfit.imageType = req.file.mimetype;
        }

        await newOutfit.save();

        res.status(201).json({ message: 'Outfit created successfully!', outfit: newOutfit });
    } catch (error) {
        console.error('Error creating outfit:', error);
        res.status(500).json({ message: 'Failed to create outfit' });
    }
});

router.get('/recommendations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const location = user.location;

        const weatherData = await getWeatherData(location);

        let outfitCriteria = {};

        if (weatherData.main.temp < 15) {
            outfitCriteria.temperatureRange = 'cold';
        } else {
            outfitCriteria.temperatureRange = 'warm';
        }

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
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const userData = {
            ...user.toObject(),
            profileImagePath: user.profileImagePath(),
        };
        res.json(userData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/signup', upload, [
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

        if (req.file != null) {
            user.profileImage = fs.readFileSync(req.file.path);
            user.profileImageType = req.file.mimetype;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err)  {
                throw err;
            }
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