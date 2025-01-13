import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// app.use(cors({origin: process.env.CORS_ORIGIN}))

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174", 
//   "https://bonntonn.netlify.app/", 
//   "https://mithai-upload.netlify.app/"
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow the request
//     } else {
//       callback(new Error("Not allowed by CORS")); // Reject the request
//     }
//   },
//   credentials: true,
// }));
// var whitelist = [
//   'http://localhost:5173',
//   'http://localhost:5174', 
//   'https://bonntonn.netlify.app/', 
//   'https://mithai-upload.netlify.app/'
// ]

// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true
// }
// app.use(cors(corsOptions));
// app.use(cors({
//   origin: "*", // Allow all origins for testing
//   credentials: true,
// }));

app.use(cors({
  origin: ["https://bonntonn.netlify.app", "https://mithai-upload.netlify.app"],
  methods: ["GET", "PUT", "DELETE", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));


// app.use(cors({
//     origin: allowedOrigins, // Replace with your frontend's URL
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   }))
app.use(express.json({limit: "500kb"}))
app.use(express.urlencoded({extended: true, limit: "500kb"}))
app.use(cookieParser())
app.use(express.static("public"))

import userRouter from './routes/user.routes.js'
import cartRouter from './routes/cart.routes.js'
import addressRouter from './routes/address.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js'
import codeRouter from './routes/code.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import productRouter from './routes/product.routes.js'
import reviewRouter from './routes/reviews.routes.js'
import catagoryRouter from './routes/catagory.routes.js'

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/address", addressRouter)
app.use("/api/v1/codes", codeRouter)
app.use("/api/v1/wishlists", wishlistRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/catagory", catagoryRouter)

export { app }