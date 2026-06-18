import { Request, Response } from "express";
import User from "../models/User";
import { generateJWT, generateRandomToken, hashToken } from "../utils/generateToken";
import { verificationEmailTemplate, passwordResetEmailTemplate, welcomeEmailTemplate } from "../utils/emailTemplate";
import { sendEmail } from "../config/email";
import { AuthRequest } from "../middlewares/authMiddleware";


//set JWT as httpOnly cookie

const sendTokenCookie = (res: Response, userId: string, role: string): void => {
  const token = generateJWT(userId, role);

  res.cookie("token", token, {
    httpOnly: true,   
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};


// REGISTER
// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
      return;
    }

    // Generate email verification token
    const rawToken = generateRandomToken();
    const hashedToken = hashToken(rawToken);

    // Create user — password is hashed automatically in User model
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      emailVerifyToken: hashedToken,
      emailVerifyExpire: new Date(
        Date.now() + Number(process.env.EMAIL_VERIFY_TOKEN_EXPIRE || 86400000)
      ),
    });

    // Verification link — goes to frontend verify-email page
   const verifyUrl = `${process.env.CLIENT_URL?.replace(/\/$/, '')}/verify-email?token=${rawToken}`;

    // Send verification email
    const { subject, html } = verificationEmailTemplate(user.name, verifyUrl);
    await sendEmail({ to: user.email, subject, html });

    res.status(201).json({
      success: true,
      message: "Account created! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};


// VERIFY EMAIL
// GET /api/auth/verify-email/:token
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const hashedToken = hashToken(Array.isArray(token) ? token[0] : token);

    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
      return;
    }

    // Mark as verified and clear the token
    user.isVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();

    // Send welcome email
    try {
      const { subject, html } = welcomeEmailTemplate(user.name);
      await sendEmail({ to: user.email, subject, html });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

// LOGIN
// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user and include password field (select: false in schema)
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Check if email is verified
    if (!user.isVerified) {
      res.status(401).json({
        success: false,
        message: "Please verify your email before logging in. Check your inbox.",
      });
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Set JWT as httpOnly cookie
    sendTokenCookie(res, user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// LOGOUT
// POST /api/auth/logout
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Clear the cookie by setting maxAge to 0
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// FORGOT PASSWORD
// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success even if user not found — security best practice
    if (!user) {
      res.status(200).json({
        success: true,
        message: "If that email is registered, you will receive a reset link shortly.",
      });
      return;
    }

    const rawToken = generateRandomToken();
    const hashedToken = hashToken(rawToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(
      Date.now() + Number(process.env.RESET_TOKEN_EXPIRE || 3600000)
    );
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL?.replace(/\/$/, '')}/reset-password?token=${rawToken}`;

    const { subject, html } = passwordResetEmailTemplate(user.name, resetUrl);
    await sendEmail({ to: user.email, subject, html });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESET PASSWORD
// POST /api/auth/reset-password/:token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Both password fields are required",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
      return;
    }

    const hashedToken = hashToken(Array.isArray(token) ? token[0] : token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset link. Please request another one.",
      });
      return;
    }

    // Update password — pre save hook will hash it
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET CURRENT USER
// GET /api/auth/me

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET ALL USERS — admin only
// GET /api/auth/users

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// DELETE USER — admin only
// DELETE /api/auth/users/:id

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE PROFILE
// PUT /api/auth/profile

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};