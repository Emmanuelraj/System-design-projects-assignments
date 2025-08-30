import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());

// Mount route modules
app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
