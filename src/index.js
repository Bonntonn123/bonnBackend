import connectDB from './db/index.js';
import dotenv from 'dotenv'
import { app } from './app.js';

dotenv.config({
    path: './env'
})

const PORT = process.env.PORT || 8000

connectDB()
.then(() => {
    app.on("error", (err) => {
        console.log("Error on app", err)
        throw err
       })

    app.get("/", (req, res) => {
        res.send("Hello World")
    })

    app.listen(PORT, (req, res) => {
        console.log(`Server Running At https://localhost:${PORT}`, PORT)  
    })
})
.catch((err) => {
    console.log("Connection Failed inside connectDB", err)
})





/*
import express from 'express'

const app = express()

(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (err) => {
        console.log(err)
        throw err
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is running on ${process.env.PORT}`)
       })
    } catch (error) {
        console.oog(error)
        throw err
    }
})()
*/