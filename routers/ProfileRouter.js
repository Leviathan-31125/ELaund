import express from "express";
import { phoneVerification, sendOTPVerification, updateProfile } from "../controllers/profileController.js";
import { Authorize } from "../middleware/Authorize.js";

const router = express.Router();

router.put('/update-profile', Authorize, updateProfile);
router.post('/send-OTP', Authorize, sendOTPVerification);
router.post('/OTP-verification', Authorize, phoneVerification);

export default router;