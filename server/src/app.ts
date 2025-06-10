import multer from 'multer'
import express from 'express'
import cors from 'cors'
import { redirectChecker } from './controllers/checker.controller.js'
import { ApiError } from './utils/ApiError.js'
import { ApiResponse } from './utils/ApiResponse.js'

const app = express()
const PORT = process.env.PORT || 5000
const upload = multer({dest: 'upload/'})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json({
    limit: "200kb"
}))


app.use(express.static("public"))

app.get("/", (req, res) => {
    res.send("redirect checker server side")
})

app.post("/api/upload", upload.single('file'), async (req, res) => {
    if(!req.file) throw new ApiError(400, 'No file Uplaod')
    console.log(req.file.path)
    redirectChecker(req.file.path)
    .then((result) => {
        // console.log(res)
        return res.status(200).json(new ApiResponse(200, result))
    })
    .catch((err) => {
        throw new ApiError(402, err)
    })
})

app.listen(PORT, () => {
    console.log(`\n\nRedirect checker server started \nURL: http://localhost:${PORT}\n`)
})
