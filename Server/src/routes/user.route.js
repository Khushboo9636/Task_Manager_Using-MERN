const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../middleware/auth.js');
const User = require('../models/user.model.js');


//Register user

router.post('/register',async(req, res ) => {
    try {
        const newUser = await registerUser(req.body);
        const token = newUser.generateAuthToken();
        res.status(201).json({user: newUser, token});

    } catch (error) {
        res.status(400).json({error: error.message });
    }
});


//login user route;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        res.json({user, token });
    } catch (error) {
        res.status(401).json({error: error.message });
        
    }
});
// Update user's name route
router.put('/update/name', async (req, res) => {
    try {
        await updateUserName(req.body);
        res.json({ message: 'User name updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user's password route
router.put('/update/password', async (req, res) => {
    try {
        await updateUserPassword(req.body);
        res.json({ message: 'User password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
