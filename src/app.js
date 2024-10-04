import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({origin: process.env.CORS_ORIGIN}))
app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(cookieParser())
app.use(express.static("public"))

import userRouter from './routes/user.routes.js'
import cartRouter from './routes/cart.routes.js'
import addressRouter from './routes/address.routes.js'

//routes declaration
// app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/carts", cartRouter)
app.use("/api/v1/address", addressRouter)

export { app }