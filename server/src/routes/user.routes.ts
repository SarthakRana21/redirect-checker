import { Router } from "express";
import { loginUser, logoutUser, registerUser, userProfile } from "../controllers/user.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const userRouter = Router();

// http://localhost:5000/api/v1/user/register
userRouter.route('/register').post(registerUser)

// http://localhost:5000/api/v1/user/login
userRouter.route('/login').post(loginUser)

// http://localhost:5000/api/v1/user/logout
userRouter.route("/logout").post(
    verifyJWT,
    logoutUser
)

// http://localhost:5000/api/v1/user/profile
userRouter.route("/profile").get(
    verifyJWT,
    userProfile
)


export default userRouter