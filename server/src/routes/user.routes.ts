import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";

const userRouter = Router();

// http://localhost:5000/api/v1/user/register
userRouter.route('/register').post(registerUser)

// http://localhost:5000/api/v1/user/login
userRouter.route('/login').post(loginUser)


export default userRouter