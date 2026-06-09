import { FastifyInstance } from "fastify"
import { DashboardController } from "../controllers/DashboardController"
import { authenticate } from "../plugins/authenticate"

export async function dashboardRoutes(app: FastifyInstance) {
    app.addHook("preHandler", authenticate)
    
    app.get("/dashboard/stats", DashboardController.getStats)
}