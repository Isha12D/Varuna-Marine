// src/adapters/inbound/http/complianceRouter.ts
import express from "express";
import { getCB, getAdjustedCB } from "../controllers/complianceController";

const router = express.Router();

router.get("/cb", getCB);
router.get("/adjusted-cb", getAdjustedCB);

export default router;
