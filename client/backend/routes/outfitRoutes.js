const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Outfit = require('../models/Outfit');
const { getWeatherData } = require("../services/weatherService");

router.post('/test-create-user', async (req, res) => {
    try {
        const newUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            location: 'New York, NY',
            preferences: 'warm'
        });

        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user' });
    }
});

router.post('/test-create-outfit', async (req, res) => {
    try {
        const newOutfit = new Outfit({
            outfitName: 'Red Top White Pant Outfit',
            temperatureRange: 'warm to too hot',
            weatherType: 'sunny',
            items: ['red top', 'white pants', 'dunks']
        });

        const savedOutfit = await newOutfit.save();
        res.json(savedOutfit);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create outfit' });
    }
});

router.get('/test-outfits', async (req, res) => {
    try {
        const outfits = await Outfit.find();
        res.json(outfits);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve outfits' });  
    }
});

router.get('/test-users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users' });  
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