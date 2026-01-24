import express from "express";
import { addResult, deleteResult, getResult, seeDetailedResult } from "../controllers/result.controller.js";

const router = express.Router();

router.get("/",getResult);

router.post("/",addResult);

router.delete("/:id",deleteResult);

router.get("/:id",seeDetailedResult);

export default router;