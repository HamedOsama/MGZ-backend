const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  tokens: [{ type: Object }],
});

userSchema.pre('save', async function () {
  const user = this
  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8)
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is mission, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error('Invalid Email');
  try {
    const user = await this.findOne({ email });
    if (user) return false;

    return true;
  } catch (error) {
    console.log('error inside isThisEmailInUse method', error.message);
    return false;
  }
};

userSchema.methods.generateJWTToken = async function () {
  try {

    const user = this
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    let oldTokens = user.tokens || [];

    if (oldTokens.length) {
      oldTokens = oldTokens.filter(t => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }

    user.tokens = [...oldTokens, { token, signedAt: Date.now().toString() }];
    await user.save();
    return token
  } catch (e) {
    console.log(e)
  }
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()
  delete userObj.password;
  delete userObj.tokens;
  return userObj
}
module.exports = mongoose.model('User', userSchema);
