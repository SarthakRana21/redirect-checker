import multer from "multer";
import { getAllJobs, getOneJob, redirectChecker } from "../controllers/checker.controller";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";

const checkerRouter = Router()
const upload = multer({dest: 'upload/'})

checkerRouter.route('/check-redirect').post(
    upload.single('file'),
    verifyJWT, 
    redirectChecker
)

checkerRouter.route('/jobs').get(
    verifyJWT,
    getAllJobs
)

checkerRouter.route('/job/:jobid').get(
    verifyJWT,
    getOneJob
)

export default checkerRouter