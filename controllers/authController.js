const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../../TaxiBackend/models/User');
const sendEmail = require('../utils/sendEmail');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.signup = async (req, res) => {
  const { fullName, email, password,selectCompany,taxiNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      selectCompany,
      taxiNumber
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      selectCompany:user.selectCompany,
      taxiNumber:user.taxiNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.sendUserPasswordResetOTP = async (req, res) => {
  try {
      const { email } = req.body;

      if (!email) {
          return res.status(400).send({
              success: false,
              message: 'Please provide an email'
          });
      }

      const user = await User.findOne({ email });
      console.log("uaer :",user);
      if (!user) {
          return res.status(404).send({
              success: false,
              message: 'Email does not exist'
          });
      }

      const otp = Math.floor(1000 + Math.random() * 9000);
      user.resetPasswordOTP = otp;
      user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      await sendEmail({
          email: user.email,
          subject: "Taxi App - Password Reset OTP",
          message: `Hi ${user.email}, Your OTP for password reset is: ${otp}`
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
      });

      res.status(200).send({
          success: true,
          message: "Password Reset OTP Sent. Please Check Your Email",
          otp,
          token
      });
  } catch (error) {
      console.log('Error in sendUserPasswordResetOTP API', error);
      res.status(500).send({
          success: false,
          message: 'Internal server error',
          error
      });
  }
};


//Confirm Password
exports.confirmUserPasswordResetOTP = async (req, res) => {
  try {
      const { email, otp } = req.body;

      if (!email || !otp) {
          return res.status(400).send({
              success: false,
              message: 'Please provide both email and OTP'
          });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send({
              success: false,
              message: 'Email does not exist'
          });
      }

   
      console.log('Stored OTP:', user.resetPasswordOTP);
      console.log('Received OTP:', otp);


      if (user.resetPasswordOTP !== parseInt(otp)) {
          return res.status(400).send({
              success: false,
              message: 'Invalid OTP'
          });
      }

      user.resetPasswordOTP = null;
      user.resetTokenExpiry = null;
      await user.save();

      res.status(200).send({
          success: true,
          message: "OTP Confirmed Successfully"
      });
  } catch (error) {
      console.log('Error in confirmUserPasswordResetOTP API', error);
      res.status(500).send({
          success: false,
          message: 'Internal server error',
          error: error.message
      });
  }
};


//Update Password
exports.updateUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = newPassword; 
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};