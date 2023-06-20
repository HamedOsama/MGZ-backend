const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');

exports.auth = async (req, res, next, role = 'admin') => {
  try {
    const { access_token: token } = req.cookies;
    if (!token) {
      return next(ServerError.badRequest(401, 'Please Login to access this resource'));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (role === 'user') {
      user = await User.findOne({ _id: decodedData.id, tokens: token });
    } else if (role === 'admin') {
      user = await Admin.findOne({ _id: decodedData.id, tokens: token });
    }
    console.log(user)
    if (!user) {
      return next(ServerError.badRequest(401, 'Please Login to access this resource'));
    }

    req.user = user;
    next();
  }
  catch (e) {
    e.statusCode = 401;
    next(e);
  }
};

exports.authUser = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById({_id:decode.id ,tokens:token});
      console.log(user)
      if (!user) {
        return res.json({ success: false, message: 'unauthorized access!' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log(error)
      if (error.name === 'JsonWebTokenError') {
        return res.json({ success: false, message: 'unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'sesson expired try sign in!',
        });
      }

      res.res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    res.json({ success: false, message: 'unauthorized access!' });
  }
};

exports.authAdmin = async (req, res, next) => {
  await exports.auth(req, res, next, 'admin');
}