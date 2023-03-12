import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';
import { sendConfirmationEmail } from '../libs/nodemailer';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email }).populate('role');

  if (!userFound) {
    res.status(400).json({ message: 'User not found' });
  }

  const matchPassword = await User.verifyPassword(password, userFound.password);

  if (!matchPassword)
    return res.status(401).json({ token: null, message: 'incorrect password' });

  if (userFound.status !== 'Active')
    return res.status(400).json({ message: 'unverified email' });

  const token = jwt.sign({ id: userFound._id }, config.SECRET, {
    expiresIn: '24h'
  });

  res.json({ token });
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
    // TODO: Hacer una exepción con el rol admin
    newUser.role = foundRole._id;
  }

  const savedUser = await newUser.save();
  const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
    expiresIn: '24h'
  });

  sendConfirmationEmail(savedUser.email, token);

  res.status(200).json({ token });
};

export const confirmEmail = async (req, res) => {
  const token = req.params.tokenId;
  try {
    const decoded = jwt.verify(token, config.SECRET);

    const user = await User.findById(decoded.id, { password: 0 });
    if (!user) return res.status(404).json({ message: 'no user found' });
    if (user.status === 'Active')
      return res.status(400).json({ message: 'email was already verified' });

    user.status = 'Active';

    await user.save();

    return res
      .status(200)
      .json('email verification has been completed successfully');

  } catch (error) {
    return res.status(401).json({ message: 'token expired or invalid' });
  }
};

export const resendEmail = async (req, res) => {
  const user = User.findOne({email: req.body.email});
  if (!user) return res.status(400).json({message: 'no user found'});

  const token = jwt.sign({ id: user._id }, config.SECRET, {
    expiresIn: '24h'
  });

  sendConfirmationEmail(user.email, token);
};