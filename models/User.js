import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: /^01[0-2,5]{1}[0-9]{8}$/,
  },
  password: { type: String, required: [true, 'Password is required'], trim: true, },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
