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