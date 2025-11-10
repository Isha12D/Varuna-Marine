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


// GET /routes/comparison — compare baseline vs others
export const getRoutesComparison = async (req: Request, res: Response) => {
  try {
    const baseline = await prisma.route.findFirst({ where: { isBaseline: true } });

    if (!baseline) {
      return res.status(404).json({ error: "No baseline route found" });
    }

    const others = await prisma.route.findMany({
      where: { NOT: { id: baseline.id } },
    });

    const comparison = others.map((r) => {
      const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = r.ghgIntensity <= baseline.ghgIntensity;

      return {
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        ghgIntensity: r.ghgIntensity,
        percentDiff: percentDiff.toFixed(2),
        compliant,
      };
    });

    res.json({
      baseline: {
        routeId: baseline.routeId,
        ghgIntensity: baseline.ghgIntensity,
      },
      comparison,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating comparison" });
  }
};
