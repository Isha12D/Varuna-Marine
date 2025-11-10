// src/adapters/inbound/http/poolRouter.ts
import express from "express";
import { createPool } from "../controllers/poolController";

const router = express.Router();

router.post("/", createPool);

export default router;
