import jwt from "jsonwebtoken";
import { userPayload } from "../../interfaces";
import dotenv from 'dotenv';

dotenv.config()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
// const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY as string || "1d"; // for some reason jwt.sign function is giving error, I have hardcoded the value for time being till i get a solution
const accessTokenExpiry = "1d"

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
// const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY as string
const refreshTokenExpiry = "7d"

export const generateAccessToken = (payload: userPayload): string => {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry, 
  });
};

export const generateRefreshToken = (id: number): string => {
  return jwt.sign(
    {
      id
    },
    refreshTokenSecret, {
      expiresIn: refreshTokenExpiry
    }
  )
}
