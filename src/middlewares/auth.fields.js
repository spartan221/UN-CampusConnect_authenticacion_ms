import User from "../models/User"

export const isEmailAlreadyInUse = async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (user) {
        return res.status(409).json({ id:'email', code:409, description:'email already exists' });
    }
    next();
}

export const isUsernameAlreadyInUse = async(req, res, next) => {
    const user = await User.findOne({username: req.body.username});
    if (user) {
        return res.status(409).json({ id:'username', code:409, description:'username already in exists' });
    }
    next();
}