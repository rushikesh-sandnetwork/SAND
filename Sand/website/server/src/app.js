import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { FRONTEND_URL } from './constants.js';
require("dotenv").config();

const app = express();

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.static("public"));

const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");
const promoterRouter = require("./routes/promoter.routes");
const misRouter = require("./routes/mis.routes");
const managerRouter = require("./routes/manager.routes");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/promoter", promoterRouter);
app.use("/api/v1/mis", misRouter);
app.use("/api/v1/manager", managerRouter);

module.exports = app;
