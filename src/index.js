import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({
    path: './env'
});

const PORT = 0; // Set PORT to 0 for dynamic port assignment

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Error on app", err);
            throw err;
        });

        app.get("/", (req, res) => {
            res.send("Hello World");
        });

        const server = app.listen(PORT, () => {
            const assignedPort = server.address().port; // Get the dynamically assigned port
            console.log(`Server Running At http://localhost:${assignedPort}`);
        });
    })
    .catch((err) => {
        console.log("Connection Failed inside connectDB", err);
    });
