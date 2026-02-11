import express from "express";
import { evaluateSubmissions } from "../controllers/judge.controller.js";

const router = express.Router();

router.post("/evaluate/:resultId",evaluateSubmissions);

export default router