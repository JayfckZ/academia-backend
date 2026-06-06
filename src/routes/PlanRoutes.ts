import { FastifyInstance } from "fastify"
import { PlanController } from "../controllers/PlanController"
import { authenticate } from "../plugins/authenticate"

export async function planRoutes(app: FastifyInstance) {
    app.post("/plans", PlanController.create)
    app.get("/plans", PlanController.findAll)
    app.get("/plans/:id", PlanController.findById)
    app.put("/plans/:id", PlanController.update)
    app.delete("/plans/:id", PlanController.delete)
}