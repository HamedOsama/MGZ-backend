const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 8)
        throw new Error("password length must be at least 8")
    }
  },
  tokens: [{
    type: String,
    required: true
  }],
}, { timestamps: true })

adminSchema.pre('save', async function () {
  const admin = this
  if (admin.isModified('password'))
    admin.password = await bcrypt.hash(admin.password, 8)
})

adminSchema.statics.Login = async function (email, pass) {
  const admin = await Admin.findOne({ email })
  if (!admin)
    throw new Error('Email is not found!');
  const isMatch = await bcrypt.compare(pass, admin.password)
  if (!isMatch)
    throw new Error('Password is wrong!')
  return admin
}
adminSchema.methods.generateJWTToken = async function () {
  const admin = this
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET)
  admin.tokens = admin.tokens.concat(token)
  await admin.save()
  return token
}
adminSchema.methods.toJSON = function () {
  const admin = this
  const adminObj = admin.toObject()
  delete adminObj.password;
  delete adminObj.tokens;
  return adminObj
}
const Admin = mongoose.model('admins', adminSchema)
module.exports = Admin;