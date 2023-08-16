import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js' 

const updateUserProfile = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    const {email , password ,passwordConfirm,provider,roles,googleID,username,isEmailVerified} = req.body;

    const user = await User.findById(userId)

    if(!user){
        res.status(400);
        throw new Error('user not found')
    }

    if(password || passwordConfirm){
        res.status(403);
        throw new Error('Password cannot be changed here . Use "Forgot Password" instead.');
    }
    if(email || isEmailVerified || provider || googleID || roles){
        res.status(400)
        throw new Error('You are not allowed to change these field here')
    }

    const fieldsToUpdate = req.body;

    const updatedProfile = await User.findByIdAndUpdate(userId,{...fieldsToUpdate},{new:true,runValidators:true}).select("-refreshToken");

    res.status(200).json({
        success:true,
        message:`Hey ${user.firstName} , your profile has been updated successfully`
    })
})

export default updateUserProfile;