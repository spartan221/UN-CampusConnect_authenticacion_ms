import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role"
    }
}, {
    versionKey: false
});


userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
userSchema.statics.verifyPassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

export default model('User', userSchema);