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
