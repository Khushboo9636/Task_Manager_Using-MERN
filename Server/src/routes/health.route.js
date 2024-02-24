const express = require('express');
const router = express.Router();

router.get('/health', function(req, res) {
    try {
        const serverInfo = {
            serverName: process.env.SERVER,
            currentTime: new Date(),
            state: 'active',
        }
        res.json(serverInfo)
    } catch (error) {
        res.json({
            status: 'Failed',
            message: "Something went wrong"
        })
        
    }
});

module.exports = router;