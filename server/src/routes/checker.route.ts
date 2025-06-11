import multer from "multer";
import { redirectChecker } from "../controllers/checker.controller.js";
import { Router } from "express";

const checkerRouter = Router()
const upload = multer({dest: 'upload/'})

checkerRouter.route('/check-redirect').post(
    upload.single('file'), 
    redirectChecker
)

export default checkerRouter