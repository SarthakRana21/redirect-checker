import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AysncHandler";
import { AuthRequest } from "../interfaces";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../../db";
import { users } from "../models/users.model";
import { eq } from "drizzle-orm";

export const verifyJWT = asyncHandler(async (req: AuthRequest, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string

        if(!accessToken) {
            req.user = undefined
            return next()
        }
    
        const decodedToken = jwt.verify(accessToken, accessTokenSecret) as JwtPayload

        const currentUser = await db.select({
            id: users.id,
            email: users.email,
            fullName: users.fullName
        }).from(users)
        .where(eq(users.id, decodedToken?.id))

        if(!currentUser || currentUser.length < 1 ) {
            throw new ApiError(401, "Invalid AccessToken")
        }
        req.user = currentUser
        next()

    } catch (error) {
        return new ApiError(401, `Unauthorized req: ${error}`)
    }
})