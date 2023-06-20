const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sharp = require('sharp');
const cloudinary = require('../helper/imageUpload');
const sendToken = require('../utils/jwtToken');


exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: 'This email is already in use, try sign-in',
    });
  const user = await User({
    fullname,
    email,
    password, 
  });
  await user.save();
  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: 'user not found, with the given email!',
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: 'email / password does not match!',
    });
  sendToken(user, 201, res);
};

exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: 'unauthorized access!' });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: 'fill',
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatar: result.url },
      { new: true }
    );
    const userInfo = {
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      avatar: updatedUser.avatar ? updatedUser.avatar : '',
    };
    res
      .status(201)
      .json({ success: true, message: 'Your profile has updated!', user: userInfo });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'server error, try after some time' });
    console.log('Error while uploading profile image', error.message);
  }
};

exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter(t => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' });
  }
};

exports.getUser = async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: 'unauthorized access!' });

  const userInfo = {
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar ? user.avatar : '',
  };

  res.json({ success: true, user: userInfo });
}
