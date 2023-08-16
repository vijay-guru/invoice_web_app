import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js'
import VerifyResetToken from '../../models/verifyResetTokenModel.js'
import sendEmail from '../../utils/sendEmail.js'
const domain = process.env.DOMAIN
const {randomBytes} = await import('crypto')

const resetPasswordRequest = asyncHandler(async(req,res)=>{

    const {email} = req.body;

    if(!email){
        res.status(401);
        throw new Error('Email must be provided')
    }
    const existingUser = await User.findOne({email}).select("-passwordConfirm");

    if(!existingUser){
        res.status(400);
        throw new Error('Unable to find user for this email');
    }

    let verificationToken = await VerifyResetToken.findOne({_userId:existingUser._id})

    if(verificationToken){
        await VerifyResetToken.deleteOne();
    }

    const resetToken = randomBytes(32).toString("hex");
    let newVerificationToken = await new VerifyResetToken({
        _userId:existingUser._id,
        token:resetToken,
        createdAt:Date.now()
    }).save();

    if(existingUser && existingUser.isEmailVerified){
        const emailLink = `${domain}/api/v1/auth/reset_password?emailToken=${newVerificationToken.token}&userId=${existingUser._id}`;
        const payload = {
            name:existingUser.firstName,
            link: emailLink
        }
    
        await sendEmail(
            existingUser.email,
            "Password Reset",
            payload,
            "./emails/template/requestResetPassword.handlebars"
        );

        res.json({
            success: true,
            message:`Hey ${existingUser.firstName} , An email has been sent to your account with password reset link.`
        });
    }
})

const resetPassword = asyncHandler(async(req,res)=>{

    const {password,passwordConfirm,userId,emailToken} = req.body;

    if(!password){
        res.status(401);
        throw new Error('Password is required ')
    }
    if(!passwordConfirm){
        res.status(401);
        throw new Error('Confirm Password is required ')
    }
    if(password !== passwordConfirm){
        res.status(401);
        throw new Error('Passwords do not match');
    }
    if(password.length < 8){
        res.status(400);
        throw new Error('Password must be at least 8 characters long')
    }

    const passwordResetToken = await VerifyResetToken.findOne({_userId:userId});

    if(!passwordResetToken){
        res.status(400)
        throw new Error('your token is either invalid or expired . Try resetting password again')
    }

    const user = await User.findOne({_id: passwordResetToken._userId}).select('-passwordConfirm')

    if(user && passwordResetToken){
        user.password = password
        await user.save();

        const payload = {
            name:user.firstName
        }
        await sendEmail(
            user.email,
            "Password Reset Success",
            payload,
            "./emails/template/resetPassword.handlebars"
        );
        res.json({
            success: true,
            message:`Hey ${user.firstName} your password reset was successful, An email has been sent to confirm the same.`
        });
    }
})

 export {resetPasswordRequest , resetPassword};