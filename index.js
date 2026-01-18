const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Database file
const dbFile = 'clicks.json';
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

// Track clicks and redirect
app.get('/track', (req, res) => {
    const postId = req.query.post_id;
    const advertiserLink = req.query.link;
    const userId = req.query.user_id || 0;

    if (!postId || !advertiserLink) return res.status(400).send("Missing parameters");

    // Read database
    const data = JSON.parse(fs.readFileSync(dbFile));

    if (!data[postId]) data[postId] = [];
    data[postId].push({ userId, timestamp: new Date(), link: advertiserLink });

    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

    // Redirect to advertiser link
    res.redirect(decodeURIComponent(advertiserLink));
});

// Stats endpoint
app.get('/stats', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbFile));
    res.json(data);
});

app.listen(PORT, () => console.log(`Tracking server running on port ${PORT}`));
