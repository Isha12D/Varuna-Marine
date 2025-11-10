import express from "express";
import {
  getBankingRecords,
  bankCB,
  applyBankedCB,
} from "../controllers/bankingController";

const router = express.Router();

router.get("/records", getBankingRecords);
router.post("/bank", bankCB);
router.post("/apply", applyBankedCB);

export default router;
