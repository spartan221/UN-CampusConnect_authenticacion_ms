import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';
import { sendConfirmationEmail } from '../libs/nodemailer';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email }).populate('role');

  if (!userFound) {
    return res.status(400).json({ id: 'user', code: 400, description: "user not found" });
  }

  const matchPassword = await User.verifyPassword(password, userFound.password);

  if (!matchPassword)
    return res.status(401).json({ id: 'password', code: 401, description: 'incorrect password' });

  if (userFound.status !== 'Active')
    return res.status(400).json({ id: 'email', code: 400, description: 'unverified email' });

  const token = jwt.sign({ id: userFound._id }, config.SECRET, {
    expiresIn: '24h'
  });

  res.json(token);
};

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  const newUser = new User({
    username,
    email,
    role,
    password: await User.encryptPassword(password)
  });

  if (role) {
    const foundRole = await Role.findOne({ name: role });
    if (foundRole.name === 'admin') return res.status(401).json({ description: 'unauthorized' });
    newUser.role = foundRole._id;
  }

  const savedUser = await newUser.save();
  const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
    expiresIn: '24h'
  });

  sendConfirmationEmail(savedUser.email, token);

  res.status(200).json(token);
};

export const confirmEmail = async (req, res) => {
  const token = req.params.tokenId;
  try {
    const decoded = jwt.verify(token, config.SECRET);

    const user = await User.findById(decoded.id, { password: 0 });
    if (!user) return res.status(404).json({ id: 'user', code: 400, description: "user not found" });
    if (user.status === 'Active')
      return res.status(400).json({ id: 'email', code: 400, description: 'email was already verified' });

    user.status = 'Active';

    await user.save();

    return res
      .status(200)
      .json('email verification has been completed successfully');

  } catch (error) {
    return res.status(401).json({ id: 'token', code: 401, description: 'token expired or invalid' });
  }
};

export const resendEmail = async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ id: 'user', code: 400, description: "user not found" });

  const token = jwt.sign({ id: user._id }, config.SECRET, {
    expiresIn: '24h'
  });

  sendConfirmationEmail(user.email, token);

  return res.status(200).json('the email has been forwarded');
};