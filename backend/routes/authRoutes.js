import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyEmail from "../controllers/auth/verifyEmailController.js";
import loginUser from "../controllers/auth/loginController.js";
import newAccessToken from "../controllers/auth/refershTokenController.js";
import resendEmailVerificationToken from "../controllers/auth/resendVerifyEmailController.js";
import { resetPassword, resetPasswordRequest } from "../controllers/auth/passwordResetController.js";
import logout from "../controllers/auth/logoutController.js";

const router = express.Router();

router.post('/register',registerUser);

router.get('/verify/:emailToken/:userId',verifyEmail);

router.post('/login',loginUser);

router.get('/new_access_token',newAccessToken);

router.post('/resend_email_token',resendEmailVerificationToken);

router.post('/reset_password_request',resetPasswordRequest);

router.post('/reset_password',resetPassword);

router.get('/logout',logout);

export default router;