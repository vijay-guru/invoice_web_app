import express from "express";
import checkAuth from "../middleware/checkAuthMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import getUserProfile from "../controllers/user/getUserProfile.js";
import updateUserProfile from "../controllers/user/updateUserProfile.js";
import deleteMyAccount from "../controllers/user/deleteMyAccountController.js";
import getAllUserAccounts from "../controllers/user/getAllUserAccountsController.js";
import deleteUserAccount from "../controllers/user/deleteUserAccountController.js";
import deactivateUser from "../controllers/user/deactivateUserContoller.js";


const router = express.Router();

router.route("/profile")
.get(checkAuth,getUserProfile)
.patch(checkAuth,updateUserProfile)
.delete(checkAuth,deleteMyAccount);

router.route("/all").get(checkAuth,role.checkRole(role.ROLE.Admin),getAllUserAccounts)

router.route("/:id").delete(checkAuth,role.checkRole(role.ROLE.Admin),deleteUserAccount)

router.route("/:id/deactivate").patch(checkAuth,role.checkRole(role.ROLE.Admin),deactivateUser)

export default router;