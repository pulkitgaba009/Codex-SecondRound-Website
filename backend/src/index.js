import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import resultRoutes from "./routes/result.routes.js";
import authRoute from "./controllers/auth.controller.js";
import settingsRoute from "./routes/settings.routes.js";
import questionsRoute from "./routes/question.routes.js";
import judgeRoutes from "./routes/judge.routes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173","http://localhost:5174"],
      credentials: true,
    }),
  );
}

app.use(express.json());

app.use("/api/result", resultRoutes);
app.use("/api/auth", authRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/question", questionsRoute);
app.use("/api/judge", judgeRoutes);

if (process.env.NODE_ENV === "production") {
  const dist_path = path.join(__dirname, "../frontend/dist");
  app.use(express.static(dist_path));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(dist_path, "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server + DB running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
