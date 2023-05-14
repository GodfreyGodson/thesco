const jwt = require('jsonwebtoken');
const User = require('../models/user');
//middlewares function to authenticate the user

const auth = async (req, res, next) => {
    try {
      // Get the token from the headers
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRETE);
  
      // Find the user by the id in the token
      const user = await User.findById(decoded._id);
  
      // If user not found or token is invalid
      if (!user) {
        throw new Error();
      }
  
      // Attach the user to the request object
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized access'
      });
    }
  };


  const isStudent =  (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }
      if (user.userType !== 'student') {
        return res.status(401).json({
          error: 'Access denied'
        });
      }
      req.profile = user;
      next();
    });
  };


  const isAdmin = (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }
      if (user.userType !== 'admin') {
        return res.status(401).json({
          error: 'Access denied'
        });
      }
      req.profile = user;
      next();
    });
  };

  module.exports = { auth,  isAdmin, isStudent };