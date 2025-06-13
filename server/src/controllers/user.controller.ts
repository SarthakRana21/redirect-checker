import { eq } from "drizzle-orm"
import { db } from "../database/db"
import { users } from "../models/users.model"
import { ApiError } from "../utils/ApiError"
import { generateAccessToken, generateRefreshToken } from "../utils/tokens/TokenGenerator"
import { asyncHandler } from "../utils/AysncHandler"

const generateRefreshAndAccessTokens = async(userId: number) => {
    try {
        const user = await db.select({
            id: users.id,
            email: users.email,
            username: users.username,
        }).from(users).where(eq(users.id, userId))

        if(!user) throw new Error

        const accessToken = generateAccessToken(user[0])
        const refreshToken = generateRefreshToken(userId)

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Error while generating Acess and Refresh Tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body
    const useFileds = [username, email, password]

    try {
        
    } catch (error) {
        console.log( "Error while regestring user",error)
    }
})