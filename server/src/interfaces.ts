export interface userPayload {
    id: number,
    username: string,
    email: string,
    password?: string,
    refreshToken?: string
}

export interface recordPayload {
    id: number,
    userId: number,
    data: string
}