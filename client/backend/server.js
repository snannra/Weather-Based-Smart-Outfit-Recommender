const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const outfitRoutes = require('./routes/outfitRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables.');
    process.exit(1); 
}

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in the environment variables.');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use('/api/outfits', outfitRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.send('Weather Based Smart Outfit Recommender Backend');
});

app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        dbConnected: mongoose.connection.readyState === 1
    });
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
