import bcrypt from 'bcrypt'

export const isPasswordCorrect = async(userPassword: string, dbPassword: string ) => {
    return await bcrypt.compare(userPassword, dbPassword)
}