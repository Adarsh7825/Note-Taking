import { Router } from 'express';
import { 
  sendSignupOTP, 
  verifyOTPAndSignup, 
  login, 
  googleAuth, 
  getCurrentUser,
  testOTP
} from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/send-otp', sendSignupOTP as any);
router.post('/verify-otp', verifyOTPAndSignup as any);
router.post('/login', login as any);
router.post('/google', googleAuth as any);
router.get('/curruser', auth as any, getCurrentUser as any);

export default router; 
