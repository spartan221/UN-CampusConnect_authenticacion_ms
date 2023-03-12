import User from "../models/User";


export const getMyPersonalInfo = async (req, res) => {
    const user = await User.findById(req.userId).populate('role');
    const { username, email, role } = user;
    return res.status(200).json({username, email, role: role.name});
}

export const getUsers = async (req, res) => {
    const usersFetched = await User.find().populate('role');
    const users = usersFetched.map((user) =>
    ({
        username: user.username, 
        email: user.email, 
        role: user.role.name
    }));
    return res.status(200).json(users);
}

export const unsubscribe = async (req, res) => {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "your account has been deleted" });
  };
  