import express from "express";
import { getAllRoutes, setBaseline } from "./controllers/routesController";

const router = express.Router();

router.get("/", getAllRoutes);
router.post("/:routeId/baseline", setBaseline);


export default router;
