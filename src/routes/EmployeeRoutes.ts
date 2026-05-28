import { FastifyInstance } from "fastify"
import { EmployeeController } from "../controllers/EmployeeController"

export async function employeeRoutes(app: FastifyInstance) {

    app.post("/employees", EmployeeController.create)

    app.get("/employees", EmployeeController.findAll)

    app.get("/employees/:id", EmployeeController.findById)

    app.put("/employees/:id", EmployeeController.update)

    app.delete("/employees/:id", EmployeeController.delete)
}