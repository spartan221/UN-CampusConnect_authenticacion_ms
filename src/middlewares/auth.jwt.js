import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';
import User from '../models/User';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).json({ message: 'not token provided' });

    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: 'no user found' });

    next();
  } catch (error) {

    return res.status(401).json({ message: 'unauthorized' });

  }
};


export const isAdmin = async(req, res, next) => {
    const user = await User.findById(req.userId);
    const role = await Role.findById(user.role._id.toString());
    if (role.name.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({ message: 'unauthorized' });
    }
    next();
}

export const isTutor = async(req, res, next) => {
  const user = await User.findById(req.userId);
  const role = await Role.findById(user.role._id.toString());
  if (role.name.toUpperCase() !== 'TUTOR ') {
    return res.status(403).json({ message: 'unauthorized' });
  }
  next();
}