import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { generateAccessToken, generateRefreshToken, AuthRequest } from '../middleware/auth';
import { verifyTOTP } from '../utils/totp';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, location, donorDetails, ngoDetails } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationCode,
      otpExpires,
      otpAttempts: 0,
      location: location || { type: 'Point', coordinates: [0, 0] },
      donorDetails: role === 'Donor' ? donorDetails : undefined,
      ngoDetails: role === 'NGO' ? ngoDetails : undefined,
      status: role === 'NGO' ? 'pending' : 'active', // NGOs require verification
    });

    await user.save();

    await AuditLog.create({
      actor: user._id,
      actorEmail: user.email,
      action: 'USER_REGISTERED',
      target: `User/${user._id}`,
      details: { role: user.role },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const isDev = process.env.NODE_ENV !== 'production';

    res.status(201).json({
      message: 'Registration successful. OTP sent for verification.',
      userId: user._id,
      verificationRequired: true,
      ...(isDev ? { otpMock: verificationCode } : {})
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.verificationCode) {
      return res.status(400).json({ error: 'No verification code was generated or code is no longer valid' });
    }

    // Check expiry
    if (user.otpExpires && new Date() > new Date(user.otpExpires)) {
      user.verificationCode = null;
      user.otpExpires = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Check attempts limit
    if (user.otpAttempts >= 3) {
      user.verificationCode = null;
      user.otpExpires = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(400).json({ error: 'Too many failed verification attempts. Please request a new OTP.' });
    }

    if (user.verificationCode !== code) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();

      if (user.otpAttempts >= 3) {
        user.verificationCode = null;
        user.otpExpires = null;
        user.otpAttempts = 0;
        await user.save();
        return res.status(400).json({ error: 'Invalid verification code. Maximum attempts reached. Code has been reset.' });
      }

      return res.status(400).json({ error: `Invalid verification code. ${3 - user.otpAttempts} attempts remaining.` });
    }

    user.emailVerified = true;
    user.verificationCode = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now login.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Enforce email verification check (VULN-08)
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // Check if 2FA enabled (VULN-03)
    if (user.twoFactorEnabled) {
      if (!otp) {
        return res.status(200).json({ twoFactorRequired: true, email: user.email });
      }
      const secret = user.twoFactorSecret || 'supersecret2fakeyforfoodsharedevelopment';
      if (!verifyTOTP(otp, secret)) {
        return res.status(400).json({ error: 'Invalid 2FA OTP' });
      }
    }

    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role, email: user.email });

    await AuditLog.create({
      actor: user._id,
      actorEmail: user.email,
      action: 'USER_LOGIN',
      target: `User/${user._id}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        status: user.status,
        stats: user.stats,
        location: user.location,
        ngoDetails: user.ngoDetails,
        donorDetails: user.donorDetails,
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { name, location, preferredFoodTypes, capacity } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (location) user.location = location;

    if (user.role === 'NGO') {
      if (preferredFoodTypes) user.ngoDetails!.preferredFoodTypes = preferredFoodTypes;
      if (capacity) user.ngoDetails!.capacity = capacity;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
