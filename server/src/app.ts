import express from 'express'
import cors from 'cors'
import checkerRouter from './routes/checker.route'
import dotenv from 'dotenv'
import userRouter from './routes/user.routes'
import cookieParser = require('cookie-parser')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}))

app.use(express.json({
    limit: "200kb"
}))

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))

app.use(cookieParser())


// Routes Decleration

// http://localhost:5000/
app.get("/", (req, res) => {
    res.send("redirect checker server side")
})

// http://localhost:5000/api/v1/check-redirect
app.use("/api/v1", checkerRouter)

// http://localhost:5000/api/v1/user/register
// http://localhost:5000/api/v1/user/login
// http://localhost:5000/api/v1/user/logout
// http://localhost:5000/api/v1/user/profile
app.use('/api/v1/user', userRouter)

app.listen(PORT, () => {
    console.log(`\n\nRedirect checker server started \nURL: http://localhost:${PORT}\n`)
})
