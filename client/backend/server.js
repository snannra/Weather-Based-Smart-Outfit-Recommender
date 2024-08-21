const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const outfitRoutes = require('./routes/outfitRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/outfits', outfitRoutes);

app.get('/', (req, res) => {
    res.send('Weather Based Smart Outfit Recommender Backend');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});