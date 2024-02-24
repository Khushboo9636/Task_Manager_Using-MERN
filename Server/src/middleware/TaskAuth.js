const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const isAuthenticated = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Missing or invalid token format' });
    }

    const tokenWithoutBearer = token.substring('Bearer '.length);

    try {
      const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_KEY);
      console.log('Decoded Token:', decoded);
     const user = await User.findById(decoded._id);

      if (!user) {
        console.log('User Not Found:', decoded._id);
        return res.status(401).json({ error: 'Unauthorized - User not found' });
      }

      req.user = user
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};


module.exports =  isAuthenticated ;

