import { Router } from "express";
import {register,verifyEmail,login,logout,forgotPassword,resetPassword,getMe,updateProfile,} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();


// PUBLIC ROUTES — no token needed

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


// PROTECTED ROUTES — must be logged in

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;