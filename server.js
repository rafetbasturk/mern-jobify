import * as dotenv from 'dotenv';
dotenv.config();
import "express-async-errors";
import express from "express";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
// dirname
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
// db
import connectDB from './db/connect.js';
// routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
// local middlewares
import notFoundMiddleware from "./middlewares/not-found.js"
import errorHandler from "./middlewares/error-handler.js"

const app = express()

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(resolve(__dirname, './client/build')));
app.use(express.json())
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", jobRouter)

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, './client/build', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandler)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start()