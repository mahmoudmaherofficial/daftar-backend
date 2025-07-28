import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({
    id: user._id,
    role: user.role,
    tokenVersion: user.tokenVersion || 0
  }, process.env.JWT_SECRET)

  return accessToken
}

export const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(newUser)

    res.status(201).json({ message: 'Account created successfully', user: newUser, accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(404).json({ message: 'User doesn\'t exists' })
    }


    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(400).json({ message: 'Password is incorrect' })
    }

    const accessToken = generateAccessToken(user)
    res.cookie('accessToken', accessToken, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: '/',
      domain: process.env.DOMAIN
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({ message: 'Logged in successfully', user: userWithoutPassword, accessToken })

  } catch (error) {
    res.status(500).json({ message: 'Failed to Login user', error })
  }
}

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('accessToken', {
      path: '/',
      domain: process.env.DOMAIN,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to logout user', error });
  }
};
