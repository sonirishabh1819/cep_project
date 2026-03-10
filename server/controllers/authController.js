const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, university, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      university: university || '',
      location: location || '',
    });

    res.status(201).json({
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
