import asyncHandler from "express-async-handler";
import User from '../../models/userModel.js';
import VerifyResetToken from "../../models/verifyResetTokenModel.js";
import sendEmail from '../../utils/sendEmail.js'

const domainUrl = process.env.DOMAIN

const verifyEmail = asyncHandler(async(req,res)=>{
    const user = await User.findOne({_id: req.params.userId}).select("-passwordConfirm");

    if(!user){
        res.status(400);
        throw new Error("Unable to find user for this token");
    }
    if(user.isEmailVerified){
        res.status(400);
        throw new Error("Email has been already verified . Please log in");
    }
    const userToken = await VerifyResetToken.findOne({
        _userId:user._id,
        token:req.params.emailToken
    });
    if(!userToken){
        res.status(400);
        throw new Error("Token invalid . Your token may have expired.");
    }

    user.isEmailVerified = true;
    await user.save();

    if(user.isEmailVerified){
        const emailLink = `${domainUrl}/login`
        const payload = {
            name:user.firstName,
            link:emailLink
        }

        await sendEmail(
            user.email,
            "Welcome - Account verified",
            './emails/template/welcome.handlebars'
        );

        res.redirect('/auth/verify');
    }
})

export default verifyEmail; 