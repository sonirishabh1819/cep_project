const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const sendEmail = require('../utils/sendEmail');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, university, location } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      // If user exists but is not verified, we'll allow re-registering / sending new OTP
      user.name = name;
      user.password = password;
      user.university = university || '';
      user.location = location || '';
    } else {
      user = new User({
        name,
        email,
        password,
        university: university || '',
        location: location || '',
        isVerified: false,
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: 'LearnShare - Verify Your Registration',
        html: `
          <h1>Welcome to LearnShare!</h1>
          <p>Please use the following 6-digit OTP to verify your account.</p>
          <h2>${otp}</h2>
          <p>This code will expire in 10 minutes.</p>
        `,
      });
      res.status(200).json({ requiresOtp: true, email: user.email, message: 'OTP sent to email' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(500).json({ message: 'Error sending OTP email, please try again' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP requested for this user' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      location: user.location,
      profilePicture: user.profilePicture,
      reputationScore: user.reputationScore,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: 'LearnShare - New OTP',
        html: `
          <h1>LearnShare OTP</h1>
          <p>Here is your new 6-digit OTP for account verification.</p>
          <h2>${otp}</h2>
          <p>This code will expire in 10 minutes.</p>
        `,
      });
      res.status(200).json({ message: 'OTP sent to email' });
    } catch (emailError) {
      console.error('Error sending resend email:', emailError);
      return res.status(500).json({ message: 'Error sending OTP email, please try again later' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      location: user.location,
      profilePicture: user.profilePicture,
      reputationScore: user.reputationScore,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, profilePicture } = req.body;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (profilePicture) user.profilePicture = profilePicture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: profilePicture || '',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      location: user.location,
      profilePicture: user.profilePicture,
      reputationScore: user.reputationScore,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, university, location, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (university !== undefined) user.university = university;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      user.profilePicture = req.file.path || req.file.filename;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
