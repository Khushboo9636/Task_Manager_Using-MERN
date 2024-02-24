const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const { registerUser, loginUser } = require('../middleware/auth.js');
const User = require('../models/user.model.js');
const isAuthenticated = require('../middleware/TaskAuth.js');

 

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


// Route for updating password
// Route for updating password and name
// Route for updating password
router.put('/update/password', isAuthenticated, async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedNewPassword },
            { new: true } // To return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
