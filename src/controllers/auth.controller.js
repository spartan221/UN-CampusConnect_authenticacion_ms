import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email }).populate('role');

  if (!userFound) {
    res.status(400).json({ message: 'User not found' });
  }

  const matchPassword = await User.verifyPassword(password, userFound.password);

  if (!matchPassword)
    return res.status(401).json({ token: null, message: 'incorrect password' });

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

  res.status(200).json({ token });
};
