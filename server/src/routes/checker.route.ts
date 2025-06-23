import multer from "multer";
import { redirectChecker } from "../controllers/checker.controller";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";

const checkerRouter = Router()
const upload = multer({dest: 'upload/'})

checkerRouter.route('/check-redirect').post(
    upload.single('file'),
    verifyJWT, 
    redirectChecker
)

export default checkerRouter