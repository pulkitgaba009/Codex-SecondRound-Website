import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import resultRoutes from "./routes/result.routes.js";
import authRoute from "./controllers/auth.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/result",resultRoutes);
app.use("/api/auth",authRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is working on port: ${PORT}`);
  });
});
