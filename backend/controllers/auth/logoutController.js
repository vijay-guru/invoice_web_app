import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js'

const logout = asyncHandler(async(req,res)=>{

    const cookies = req.cookies;
    if(!cookies?.jwt){
        res.status(204);
        throw new Error('No cookies found');
    }

    const refreshToken = cookies.jwt;
    const existingUser = await User.findOne({refreshToken})

    if(!existingUser){
        res.clearCookie("jwt",{
            httpOnly:true,
            secure:true,
            sameSite:"None"
        });
        res.sendStatus(204);
    }

    console.log(existingUser)
    console.log(existingUser.refreshToken)
    existingUser.refreshToken = existingUser.refreshToken.filter((refT => refT !== refreshToken));

    await existingUser.save();
    res.clearCookie("jwt",{
        httpOnly:true,
        secure:true,
        sameSite:"None"
    });

    res.status(200).json({
        success:true,
        message:`Hey ${existingUser.firstName} , you have been logged out successfully !!!`
    });
})

export default logout;