import express from "express";
import { getAllRoutes, setBaseline, getRoutesComparison } from "./controllers/routesController";

const router = express.Router();

router.get("/", getAllRoutes);
router.post("/:routeId/baseline", setBaseline);
router.get("/comparison", getRoutesComparison);

export default router;
