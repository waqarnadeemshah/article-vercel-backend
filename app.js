import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "dotenv/config";
import { authroute } from "./route/auth.route.js";
import { adminroute } from "./route/admin.route.js";
import { userroute } from "./route/user.route.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    origin:"https://article-vercel-frontend.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser())
//endpoints
app.use("/api/auth", authroute);
app.use("/api/admin", adminroute);
app.use("/api/user", userroute);

mongoose.connect(process.env.MONGODBURI).then(() => {
  console.log("data connenct");
  app.listen(process.env.PORT, () => {
    console.log("server runing ");
  });
});
