const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const registerUser = async (userData) => {
    try {
         
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const newUser  = new User(userData);
        await newUser.save();
        console.log(newUser,"Data Save successfully");

        return newUser;
    } catch (error) {
        throw error;
        
    }
};

const loginUser = async (email, password) => {
    try {
        
        const user = await User.findOne({ email });
        if(!user){
            throw new Error("Invalid email or password");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            throw new Error("Invalid email or password");

        }
        
        const token = user.generateAuthToken();
        console.log('Generated Token:', token);
        console.log("login Successfully");
        return { user, token };

    } catch (error) {
        throw error;
        
    }
};


// const updateUserPassword = async ({ name, oldPassword, newPassword }) => {
//     try {
//         const user = await User.findOne({ name });
//         if (!user) {
//             throw new Error('User not found.');
//         }

//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             throw new Error('Invalid old password.');
//         }

//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//         console.log('Hashed new password:', hashedNewPassword);

//         user.password = hashedNewPassword;
//         await user.save();

//         console.log('Password updated successfully');

//     } catch (error) {
//         throw error;
//     }
// };


const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to authorize user
const authorizeUser = async (req, res, next) => {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    next();
};



module.exports = { registerUser, loginUser, authorizeUser, verifyToken};

