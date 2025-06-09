import multer from 'multer'
import express from 'express'
import cors from 'cors'
import { redirectChecker } from './controllers/checker.controller'
import { ApiError } from './utils/ApiError'
import { ApiResponse } from './utils/ApiResponse'

const app = express()
const PORT = process.env.PORT || 5000
const upload = multer({dest: 'upload/'})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({
    limit: "200kb"
}))


app.use(express.static("public"))

app.get("/", (req, res) => {
    res.send("redirect checker server side")
})

app.post("/upload", upload.single('file'), async (req, res) => {
    if(!req.file) throw new ApiError(400, 'No file Uplaod')
    
    new ApiResponse(202, "File processing started")
    redirectChecker(req.file.path)
    .then((res) => {
        return new ApiResponse(200, res)
    })
    .catch((err) => {
        throw new ApiError(402, err)
    })
})

app.listen(PORT, () => {
    console.log(`\n\nRedirect checker server started \nURL: http://localhost:${PORT}\n`)
})
