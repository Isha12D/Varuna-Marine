import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// GET /routes — fetch all routes
export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching routes" });
  }
};

// POST /routes/:routeId/baseline — mark as baseline
export const setBaseline = async (req: Request, res: Response) => {
  const { routeId } = req.params;
  try {
    // Reset all baselines first
    await prisma.route.updateMany({ data: { isBaseline: false } });
    // Set this one as baseline
    await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });
    res.json({ message: `Route ${routeId} set as baseline` });
  } catch (err) {
    res.status(500).json({ error: "Error updating baseline" });
  }
};

