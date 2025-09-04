import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import todoRoutes from './routes/todo';
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());

// Mount route modules
app.use("/users", userRoutes);

app.use("/todos", todoRoutes);

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
};


connectToDatabase().then(() => {
    const PORT = process.env.PORT || 2000; 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});






