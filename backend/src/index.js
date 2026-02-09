import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import resultRoutes from "./routes/result.routes.js";
import authRoute from "./controllers/auth.controller.js";
import settingsRoute from "./routes/settings.routes.js"
import questionsRoute from "./routes/question.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/result",resultRoutes);
app.use("/api/auth",authRoute);
app.use("/api/settings",settingsRoute);
app.use("/api/question",questionsRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is working on port: ${PORT}`);
  });
});
