import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET /banking/records?shipId&year
export const getBankingRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shipId, year } = req.query;

    if (!shipId || !year) {
      res.status(400).json({ error: "Missing shipId or year" });
      return;
    }

    const records = await prisma.bankingRecord.findMany({
      where: {
        shipId: String(shipId),
        year: parseInt(year as string, 10),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(records);
  } catch (err) {
    console.error("Error fetching banking records:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

// ✅ POST /banking/bank
export const bankCB = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shipId, year, amount } = req.body;

    if (!shipId || !year) {
      res.status(400).json({ error: "Missing shipId or year" });
      return;
    }

    const ship = await prisma.ship.findUnique({ where: { id: shipId } });
    if (!ship) {
      res.status(404).json({ error: "Ship not found" });
      return;
    }

    if (ship.cb <= 0) {
      res.status(400).json({ error: "No positive CB to bank" });
      return;
    }

    const bankAmount = amount || ship.cb;

    await prisma.ship.update({
      where: { id: shipId },
      data: {
        cb: ship.cb - bankAmount,
        bankedCB: ship.bankedCB + bankAmount,
      },
    });

    await prisma.bankingRecord.create({
      data: {
        shipId,
        year,
        action: "BANK",
        amount: bankAmount,
      },
    });

    res.json({
      message: "CB banked successfully",
      cb_before: ship.cb,
      applied: bankAmount,
      cb_after: ship.cb - bankAmount,
    });
  } catch (err) {
    console.error("Error banking CB:", err);
    res.status(500).json({ error: "Failed to bank CB" });
  }
};

// ✅ POST /banking/apply
export const applyBankedCB = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shipId, year, amount } = req.body;

    if (!shipId || !year) {
      res.status(400).json({ error: "Missing shipId or year" });
      return;
    }

    const ship = await prisma.ship.findUnique({ where: { id: shipId } });
    if (!ship) {
      res.status(404).json({ error: "Ship not found" });
      return;
    }

    if (amount > ship.bankedCB) {
      res.status(400).json({ error: "Insufficient banked CB" });
      return;
    }

    await prisma.ship.update({
      where: { id: shipId },
      data: {
        cb: ship.cb + amount,
        bankedCB: ship.bankedCB - amount,
      },
    });

    await prisma.bankingRecord.create({
      data: {
        shipId,
        year,
        action: "APPLY",
        amount,
      },
    });

    res.json({
      message: "Banked CB applied successfully",
      cb_before: ship.cb,
      applied: amount,
      cb_after: ship.cb + amount,
    });
  } catch (err) {
    console.error("Error applying banked CB:", err);
    res.status(500).json({ error: "Failed to apply banked CB" });
  }
};
