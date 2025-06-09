import { NextFunction, Request, Response } from "express"

const asyncHandler = (reqHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>)  => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(reqHandler(req, res, next))
        .catch((err) => {
            next(err)
        })
    }
}
export {asyncHandler}
