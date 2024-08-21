const express = require('express');
const router = express.Router();

router.get('/recommendations', (req, res) => {
    res.send('This will be the outfit recommendation endpoint');
});

module.exports = router;