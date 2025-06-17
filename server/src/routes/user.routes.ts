import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

// http://localhost:5000/api/v1/user/register
userRouter.route('/register').post(registerUser)


export default userRouter