/*
  Warnings:

  - A unique constraint covering the columns `[routeId]` on the table `Route` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "Route"("routeId");
