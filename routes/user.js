const express = require('express');

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
  getUser,
} = require('../controllers/user');
const { authUser } = require('../middlewares/auth');
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require('../middlewares/validation/user');

const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post('/create-user', validateUserSignUp, userVlidation, createUser);
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);
router.get('/sign-out', authUser, signOut);
router.post(
  '/upload-profile',
  authUser,
  uploads.single('profile'),
  uploadProfile
);
router.get('/profile', authUser, getUser)

module.exports = router;
