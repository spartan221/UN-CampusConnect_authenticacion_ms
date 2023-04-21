import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../models/Role';
import User from '../models/User';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).json({ id: 'token', code: 403 , description: 'token is missing' });

    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ id: 'user', code: 404, description: 'user not found' });

    next();
  } catch (error) {

    return res.status(401).json({ id: 'unauthorized', code: 401, description: 'you are not authorized'  });

  }
};


export const isAdmin = async(req, res, next) => {
    const user = await User.findById(req.userId);
    const role = await Role.findById(user.role._id.toString());
    if (role.name.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({ id: 'unauthorized', code: 403, description: 'only an admin can perform this operation' });
    }
    next();
}

export const isTutor = async(req, res, next) => {
  const user = await User.findById(req.userId);
  const role = await Role.findById(user.role._id.toString());
  if (role.name.toUpperCase() !== 'TUTOR ') {
    return res.status(403).json({ id: 'unauthorized', code: 403, description: 'only an tutor can perform this operation' });
  }
  next();
}