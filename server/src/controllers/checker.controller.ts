import { asyncHandler } from '../utils/AysncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { redirectQueue } from '../jobs/queue';
import { AuthRequest } from '../interfaces';
import { JwtPayload } from 'jsonwebtoken';


export const redirectChecker = asyncHandler(async (req: AuthRequest, res) => {
    const path = req.file?.path
    const user = req.user as JwtPayload

    if (!path) throw new ApiError(400, "No file uploaded")

    try {
        const job = await redirectQueue.add('redirect-check', {filePath: path})



    } catch (error) {
        throw new ApiError(402, error as string)
    }
   // await fs.unlink(path)
    // console.log(result)
   // return res.status(200).json(new ApiResponse(200, result))
})

