// src/adapters/inbound/http/controllers/poolController.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * POST /pools
 * body: { members: [{ shipId: string, cb: number }] }
 * Rules:
 * - Sum(CB) >= 0
 * - Deficit ship cannot exit worse
 * - Surplus ship cannot exit negative
 */
export const createPool = async (req: Request, res: Response) => {
  const { year, members } = req.body;

  if (!year || !members || !Array.isArray(members)) {
    return res.status(400).json({ error: "Missing year or members" });
  }

  try {
    let totalCB = members.reduce((sum: number, m: any) => sum + m.cb, 0);
    if (totalCB < 0) return res.status(400).json({ error: "Total CB < 0, cannot create pool" });

    // Simple greedy allocation
    const sorted = [...members].sort((a, b) => b.cb - a.cb);
    const results = sorted.map((m: any) => ({ ...m, cb_after: m.cb })); // for now, just echo

    const pool = await prisma.pool.create({
      data: {
        year,
        poolMembers: {
          create: results.map((m: any) => ({
            shipId: m.shipId,
            cb_before: m.cb,
            cb_after: m.cb_after,
          })),
        },
      },
      include: { poolMembers: true },
    });

    res.json(pool);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create pool" });
  }
};
