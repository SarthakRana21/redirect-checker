import { Request } from "express";
import { JwtPayload } from "jsonwebtoken"

export interface userPayload {
    id: number,
    fullName: string,
    email: string,
    password?: string,
    refreshToken?: string
}

export interface recordPayload {
    id: number,
    userId: number,
    data: string
}

export interface AuthRequest extends Request {
    user?: JwtPayload
}