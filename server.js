import path from "path";
import express from "express";
import connect_mongo from "./connection/connection.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import Authroutes from "./routes/Authroutes.js";
import Messageroutes from "./routes/messageRoutes.js";
import userroutes from "./routes/user.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

app.use(cors({
  origin: "*", // Allow all origins for testing (update for production)
  methods: ["GET", "POST", "OPTIONS"], // Allow specified methods
  allowedHeaders: ["Origin", "Content-Type", "X-Auth-Token"], // Allow specific headers
  credentials: true, // Allow credentials if needed
}));

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.use(express.json()); // To parse incoming request bodies (JSON)
app.use(cookieParser());

// API routes
app.use("/api/auth/", Authroutes);
app.use("/api/message/", Messageroutes);
app.use("/api/user/", userroutes);

server.listen(8001, () => {
  console.log("Server Started");
  connect_mongo();
});
