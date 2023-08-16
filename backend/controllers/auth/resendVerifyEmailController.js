import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js'
import VerifyResetToken from '../../models/verifyResetTokenModel.js'
import sendEmail from '../../utils/sendEmail.js'
const domain = process.env.DOMAIN
const {randomBytes} = await import('crypto')

const resendEmailVerificationToken = asyncHandler(async(req,res)=>{
    const {email} = req.body

    if(!email){
        res.status(401);
        throw new Error('Email must be provided')
    }
    const user = await User.findOne({email});
    if(!user) {
        res.status(400);
        throw new Error('Unable to find user for this email')
    }

    if(user.isEmailVerified){
        res.status(400);
        throw new Error('Email has been already verified');
    }

    let verificationToken = await VerifyResetToken.findOne({_userId:user._id})

    if(verificationToken){
        await VerifyResetToken.deleteOne();
    }

    const resetToken = randomBytes(32).toString("hex");
    let emailToken = await new VerifyResetToken({
        _userId:user._id,
        token:resetToken
    }).save();

    const emailLink = `${domain}/api/v1/auth/verify/${emailToken.token}/${user._id}`;

    const payload = {
        name:user.firstName,
        link: emailLink
    }

    await sendEmail(
        user.email,
        "Account Verification",
        payload,
        "./emails/template/accountVerification.handlebars"
    );

    res.json({
        success: true,
        message:`A new user ${user.firstName} has been registered. A verification email has been sent to your account. Please verify within 15 mins.`
    });

})

export default resendEmailVerificationToken;