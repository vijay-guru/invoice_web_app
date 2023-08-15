import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyEmail from "../controllers/auth/verifyEmailController.js";
import loginUser from "../controllers/auth/loginController.js";
import newAccessToken from "../controllers/auth/refershTokenController.js";

const router = express.Router();

router.post('/register',registerUser);

router.get('/verify/:emailToken/:userId',verifyEmail);

router.post('/login',loginUser);

router.get('/new_access_token',newAccessToken);

export default router;