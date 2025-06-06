import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import "dotenv/config";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";


const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// For POST requests to handle large data (up to 10mb)
// app.use(express.json({ limit: '10mb' })); // default 100kb bo'lishi mumkin
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// For post small json data
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
})); // Allow requests from the client URL         
app.use("/api/auth", authRoutes);  
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    }
    );
}


server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
}) 