import express from 'express'
import cors from 'cors'
import checkerRouter from './routes/checker.route.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

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
