import express from "express";
import authentication from "../controllers/auth.controller";

const router = express.Router();

router.post("/",authentication);

export default router;