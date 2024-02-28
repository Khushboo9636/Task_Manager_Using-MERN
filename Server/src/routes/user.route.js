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
router.get('/showname',isAuthenticated, async (req, res) => {
    try {
      
      const userId = req.user._id; 
     
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
     
      res.json({ name: user.name });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
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
        const { email, oldPassword, newPassword,newName } = req.body;
        console.log('Received data:', { email, oldPassword, newPassword, newName });
     
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
            { password: hashedNewPassword, name: newName  },
            { new: true } // To return the updated document
        );
        console.log('Updated user:', updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Password and name updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
