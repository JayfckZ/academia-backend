import { FastifyInstance } from "fastify"
import { EmployeeController } from "../controllers/EmployeeController"
import { authenticate } from "../plugins/authenticate"

export async function employeeRoutes(app: FastifyInstance) {
    app.addHook("preHandler", authenticate)

    app.post("/employees", EmployeeController.create)
    app.get("/employees", EmployeeController.findAll)
    app.get("/employees/:id", EmployeeController.findById)
    app.put("/employees/:id", EmployeeController.update)
    app.delete("/employees/:id", EmployeeController.delete)
}