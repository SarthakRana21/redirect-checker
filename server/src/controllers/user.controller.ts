import { eq } from "drizzle-orm"
import { db } from "../database/db"
import { users } from "../models/users.model"
import { ApiError } from "../utils/ApiError"
import { generateAccessToken, generateRefreshToken } from "../utils/tokens/TokenGenerator"
import { asyncHandler } from "../utils/AysncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import bcrypt from 'bcrypt'

const generateRefreshAndAccessTokens = async(userId: number | bigint) => {
    try {
        const user = await db.select({
            id: users.id,
            email: users.email,
            fullName: users.fullName,
        }).from(users).where(eq(users.id, Number(userId)))

        if(!user) throw new Error

        const accessToken = generateAccessToken(user[0])
        const refreshToken = generateRefreshToken(userId)

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Error while generating Acess and Refresh Tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const {fullName, email, password} = req.body
    const userFields = [fullName, email, password]

    try {
        if (userFields.some((item) => !item || item?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
        }
        
        const user = await db.select().from(users).where(eq(users.email, email))

        if(!user) {
            const hashedPass = await bcrypt.hash(password, 10)

            const newRecord = await db.insert(users).values({
                fullName,
                email,
                password: hashedPass
            })
            const {accessToken, refreshToken} = await generateRefreshAndAccessTokens(newRecord.lastInsertRowid)

            const updatedRecord = await db.update(users).set({refreshToken}).where(eq(users.id, Number(newRecord.lastInsertRowid)))

            const options = {
                httpOnly: true,
                secure: true
            }
            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {
                    fullName,
                    email,
                }, "User Register Successfully")
            )

        }
        return res.status(409).json(
            new ApiResponse(409, "User already Exist")
        )

    } catch (error) {
        console.log( "Error while regestring user",error)
        throw new ApiError(500, "something went wrong while registering a user")
    }
})