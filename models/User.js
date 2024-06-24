const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // newpassword: {
  //       type: String,
  //       // validate: {
  //       //     validator: function(value) {
  //       //         return value === this.password;
  //       //     },
  //       //     message: "Passwords do not match"
  //       // }
  //   },
  resetPasswordOTP :{
        type:Number,
    },
  selectCompany: {
    type: String,
    required: true,
  },
  taxiNumber: {
    type: String,
    required: true,
  },
  resetToken: String,
    resetTokenExpiry: Date
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
