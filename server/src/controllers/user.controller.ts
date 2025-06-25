import { eq } from "drizzle-orm";
import { db } from "../../db"
import { users } from "../models/users.model";
import { ApiError } from "../utils/ApiError";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens/TokenGenerator";
import { asyncHandler } from "../utils/AysncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt";
import { isPasswordCorrect } from "../utils/PasswordChecker";
import { AuthRequest } from "../interfaces";
import { JwtPayload } from "jsonwebtoken";

const generateRefreshAndAccessTokens = async (userId: number) => {
    try {
        const user = await db
            .select({
                id: users.id,
                email: users.email,
                fullName: users.fullName,
            })
            .from(users)
            .where(eq(users.id, userId));

        if (!user || user.length === 0) {
            throw new Error("User not found while generating tokens.");
        }

        const accessToken = generateAccessToken(user[0]);
        const refreshToken = generateRefreshToken(userId);

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Error while generating access and refresh tokens");
    }
};

// Register User Controller
const registerUser = asyncHandler(async (req, res) => {

    if (!req.body) {
        return res.status(400).json(
            new ApiResponse(400,"Missing request body")
        );
    }
    const { fullName, email, password } = req.body;

    if (![fullName, email, password].every((item) => item && item.trim() !== "")) {
        res.status(400).json(
            new ApiResponse(400, "All fields are required")
        )
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
        return res.status(409).json(new ApiResponse(409, "User already exists"));
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newRecord = await db.insert(users).values({
        fullName,
        email,
        password: hashedPass,
    });

    const insertedId = Number((newRecord as any).lastInsertRowid);

    const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(insertedId);

    await db.update(users).set({ refreshToken }).where(eq(users.id, insertedId));

    const options = {
        httpOnly: true,
        secure: true, // set to false in development if needed
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { fullName, email },
                "User registered successfully"
            )
        );
});

// Login user controller
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(402).json(
            new ApiResponse(402, null, "All fields are required")
        )
    }

    try {
        const user = await db.select().from(users).where(eq(users.email, email))

        if(user.length == 0) return res.status(203).json(
            new ApiResponse(404, null, "User does not exist")
        )

        const dbPass = user[0].password
        const checkPass = await isPasswordCorrect(password, dbPass)

        if (!checkPass) res.status(401).json(
            new ApiResponse(401, null, "Credentails are not Valid")
        ) 

        const {accessToken, refreshToken} = await generateRefreshAndAccessTokens(user[0].id)

        const options = {
            httpOnly: true,
            secure: true, // set to false in development if needed
        };

        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                name: user[0].fullName,
                email: user[0].email
            }, "Login Sucess")
        )

        
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while loging in", error as any)
    }

}) 

const logoutUser = asyncHandler(async (req: AuthRequest, res) => {
    const user = req.user as JwtPayload

    try {
        if(!user) {
            res.status(401).json(
                new ApiResponse(401, null, "Invalid User")
            )
        }
        const update = await db.update(users).set({
            refreshToken: null
        }).where(eq(users.id, user[0].id))
        
        console.log("logout",update)

        const options = {
            httpOnly: true,
            secure: true, // set to false in development if needed
        };

        res.status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, "logout sucess")
        )

    } catch (error) {
        
    }
})

const userProfile = asyncHandler(async (req: AuthRequest, res) => {
    const user = req.user as JwtPayload
    if(!user) return res.status(401).json(
        new ApiResponse(401, "invalid user")
    )
    
    try {
        const profile = await db.select({
            id: users.id,
            fullName: users.fullName,
            email: users.email
        }).from(users).where(eq(users.id, user[0].id))
        // console.log(profile)
        return res.status(200)
        .json(
            new ApiResponse(200, profile, "user profile")
        )

    } catch (error) {
        console.log(error)
        throw new ApiError(400, "something went wrong in user profile")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    userProfile
}