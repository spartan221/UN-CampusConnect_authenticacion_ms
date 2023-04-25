import Role from '../models/Role';
import User from '../models/User';

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) {
      return;
    }

    const values = await Promise.all([
      new Role({ name: 'student' }).save(),
      new Role({ name: 'admin' }).save(),
      new Role({ name: 'tutor' }).save()
    ]);
    
  } catch (error) {
    console.log(error);
  }
};

export const createAdmin = async (email, pass) => {
  const adminUser = await User.findOne({username: 'admin'});
  if ( adminUser ) return;

  const adminRole = await Role.findOne({name: 'admin'});

  if ( !email ||  !pass ) {
    throw new Error(`Credentials for admin account must be provides as env variables. 
    Please check ADMIN_EMAIL and ADMIN_PASS`);
  }

  const admin = new User({
    username: 'admin',
    email: email,
    password: await User.encryptPassword(pass),
    status: 'Active',
    role: adminRole._id
  });

  const savedUser = await admin.save();

  return savedUser;

};
