import express from 'express'
import cors from 'cors'
import checkerRouter from './routes/checker.route.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}))
console.log(process.env.ORIGIN)
app.use(express.json({
    limit: "200kb"
}))

app.use(express.static("public"))

// routes decleration
// http://localhost:5000/
app.get("/", (req, res) => {
    res.send("redirect checker server side")
})
// http://localhost:5000/api/v1/check-redirect
app.use("/api/v1", checkerRouter)


app.listen(PORT, () => {
    console.log(`\n\nRedirect checker server started \nURL: http://localhost:${PORT}\n`)
})
