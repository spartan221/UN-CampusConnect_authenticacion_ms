import User from "../models/User";

export const getUserInfo = async (req, res) => {
    const user = await User.findById(req.params.id).populate('role');
    const { id, username, email, role } = user;
    return res.status(200).json({id, username, email, role: role.name});
}

export const getMyPersonalInfo = async (req, res) => {
    const user = await User.findById(req.userId).populate('role');
    const { id, username, email, role, status } = user;
    return res.status(200).json({id, username, email, role: role.name, status});
}

export const getUsers = async (req, res) => {
    const usersFetched = await User.find().populate('role');
    const users = usersFetched.map((user) =>
    ({
        id: user._id,
        username: user.username, 
        email: user.email, 
        role: user.role.name
    }));
    return res.status(200).json(users);
}

export const unsubscribe = async (req, res) => {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    return res.status(200).json("your account has been deleted");
  };
  