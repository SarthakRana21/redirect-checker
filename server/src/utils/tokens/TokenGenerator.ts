import jwt from "jsonwebtoken";
import { userPayload } from "../../interfaces";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
// const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY as string || "1d"; // for some reason jwt.sign function is giving error, I have hardcoded the value for time being till i get a solution

const accessTokenExpiry = "1d"

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
    accessTokenSecret, {
      expiresIn: accessTokenExpiry
    }
  )
}
