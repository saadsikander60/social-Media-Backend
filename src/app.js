import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

app.use("/api/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };
