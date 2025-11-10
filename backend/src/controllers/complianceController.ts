// src/adapters/inbound/http/controllers/complianceController.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// GET /compliance/cb?shipId&year — compute current CB
export const getCB = async (req: Request, res: Response) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "Missing shipId or year" });

  try {
    const ship = await prisma.ship.findUnique({ where: { id: shipId as string } });
    if (!ship) return res.status(404).json({ error: "Ship not found" });

    res.json({ cb: ship.cb, bankedCB: ship.bankedCB });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch CB" });
  }
};

// GET /compliance/adjusted-cb?shipId&year — CB after banking
export const getAdjustedCB = async (req: Request, res: Response) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "Missing shipId or year" });

  try {
    const ship = await prisma.ship.findUnique({ where: { id: shipId as string } });
    if (!ship) return res.status(404).json({ error: "Ship not found" });

    // CB after bankedCB applied
    const adjustedCB = ship.cb + ship.bankedCB;
    res.json({ cb_before: ship.cb, bankedCB: ship.bankedCB, cb_after: adjustedCB });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch adjusted CB" });
  }
};
