import { asyncHandler } from '../utils/AysncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { redirectQueue } from '../jobs/queue';
import { AuthRequest } from '../interfaces';
import { JwtPayload } from 'jsonwebtoken';
import { db } from '../../db';
import { records } from '../models/records.model';
import { InferInsertModel, ne } from 'drizzle-orm';


type InsertObject = InferInsertModel<typeof records>;

export const redirectChecker = asyncHandler(async (req: AuthRequest, res) => {
    const path = req.file?.path
    const user = req.user as JwtPayload

    console.log(user)
    if(!user) return res.status(401).json(
        new ApiResponse(401, "Please login to check redirects")
    )
    
    if (!path) throw new ApiError(400, "No file uploaded")

    try {
        const job = await redirectQueue.add('redirect-check', {filePath: path}, {
            removeOnComplete: true,
            removeOnFail: true        
        })

        const userId = parseInt(user[0]?.id ?? "0") as number;
        const jobStatus = (await job.getState()) ?? "unknown" as string

        await db.insert(records).values({
            userId: userId,
            jobId: job.id,
            status: jobStatus,
            createdAt: new Date(job.timestamp).toISOString(),
        } as InsertObject)    

        return res.status(200).json(
            new ApiResponse(200, {
                jobId: job.id,
                jobStatus: jobStatus,
                createdAt: new Date(job.timestamp).toISOString()
            }, "Job added sucess")
        )
    } catch (error) {
        throw new ApiError(402, error as string)
    }
   // await fs.unlink(path)
    // console.log(result)
   // return res.status(200).json(new ApiResponse(200, result))
})

