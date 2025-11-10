import express from "express";
import cors from "cors";
import routeRouter from "./routeRouter";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/routes", routeRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

