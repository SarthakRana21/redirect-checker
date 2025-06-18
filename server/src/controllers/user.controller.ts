import { eq } from "drizzle-orm";
import { db } from "../../db"
import { users } from "../models/users.model";
import { ApiError } from "../utils/ApiError";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens/TokenGenerator";
import { asyncHandler } from "../utils/AysncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt";
import { isPasswordCorrect } from "../utils/PasswordChecker";

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


export {
    registerUser,
    loginUser
}