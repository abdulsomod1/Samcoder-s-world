const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.'));

const reviewsFile = path.join(__dirname, 'reviews.json');

// Initialize reviews file if it doesn't exist
if (!fs.existsSync(reviewsFile)) {
    fs.writeFileSync(reviewsFile, JSON.stringify([]));
}

// Get reviews
app.get('/api/reviews', (req, res) => {
    try {
        const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load reviews' });
    }
});

// Submit review
app.post('/api/reviews', (req, res) => {
    try {
        const { name, location, stars, text } = req.body;
        console.log('POST /api/reviews - body:', req.body);
        if (!name || !location || !stars || !text) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
        const newReview = { name, location, stars, text, id: Date.now() };
        reviews.push(newReview);
        try {
            fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
        } catch (fsErr) {
            console.error('Failed to write reviews file:', fsErr);
            return res.status(500).json({ error: 'Failed to save review' });
        }
        res.json({ success: true, review: newReview });
    } catch (error) {
        console.error('POST /api/reviews error:', error);
        res.status(500).json({ error: 'Failed to save review' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
