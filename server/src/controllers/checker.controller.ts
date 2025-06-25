import { asyncHandler } from '../utils/AysncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { redirectQueue } from '../jobs/queue';
import { AuthRequest } from '../interfaces';
import { JwtPayload } from 'jsonwebtoken';
import { db } from '../../db';
import { records } from '../models/records.model';
import { and, eq, InferInsertModel} from 'drizzle-orm';
import dayjs from 'dayjs';


type InsertObject = InferInsertModel<typeof records>;

const redirectChecker = asyncHandler(async (req: AuthRequest, res) => {
    const path = req.file?.path
    const user = req.user as JwtPayload

    // console.log(user)
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
            createdAt: dayjs(job.timestamp).format('MMMM D, YYYY h:mm A'),
        } as InsertObject)    

        return res.status(200).json(
            new ApiResponse(200, {
                jobId: job.id,
                jobStatus: jobStatus,
                createdAt: dayjs(job.timestamp).format('MMMM D, YYYY h:mm A')
            }, "Job added sucess")
        )
    } catch (error) {
        throw new ApiError(402, error as string)
    }
   // await fs.unlink(path)
    // console.log(result)
   // return res.status(200).json(new ApiResponse(200, result))
})

const getAllJobs = asyncHandler(async (req: AuthRequest, res) => {
    const user = req?.user

    if(!user) return res.status(401).json(
        new ApiResponse(401, "Please login to check redirects")
    )

    try {
        const allJobs = await db.select({
            jobId: records.jobId,
            status: records.status,
            createdAt: records.createdAt
        }).from(records).where(eq(records.userId, user[0].id)) 
        
        return res.status(200).json(
            new ApiResponse(200, allJobs, "All jobs fetch sucess")
        )
    } catch (error) {
        throw new ApiError(500, `something went wrong while fetching all jobs \n ${error}`)
    }

})

const getOneJob = asyncHandler(async (req: AuthRequest, res) => {
    const { jobid } = req.params
    const user = req?.user

    if(!user) return res.status(401).json(
        new ApiResponse(401, "Please login to check redirects")
    )
    try {
        const jobData = await db.select({
            jobId: records.jobId,
            status: records.status,
            data: records.data,
            createdAt: records.createdAt
        }).from(records).where(
            and(
                eq(records.userId, user[0].id),
                eq(records.jobId, jobid)
            )
        ) 

        if (jobData.length === 0) {
            return res.status(404).json(
                new ApiResponse(404, null, `No job found with jobid: ${jobid}`)
            );
        }
        // console.log(jobData)
        const payload = {
            ...jobData[0],
            data: jobData[0].data ? JSON.parse(jobData[0].data) : null
        }

        return res.status(200).json(
            new ApiResponse(200, {...payload}, `Job data for jobid: ${jobid}`)
        )

    } catch (error) {
        throw new ApiError(400, `Error while fetching a single job \n${error}`)
    }

})

export {
    redirectChecker,
    getAllJobs,
    getOneJob
}