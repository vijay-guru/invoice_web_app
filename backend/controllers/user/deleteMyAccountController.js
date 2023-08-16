import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js' 

const deleteMyAccount = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);
    res.json({
        success: true,
        message: "Your account has been deleted successfully"
    });
})

export default deleteMyAccount;