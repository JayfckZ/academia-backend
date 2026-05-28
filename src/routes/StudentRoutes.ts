import { FastifyInstance } from "fastify"
import { StudentController } from "../controllers/StudentController"

export async function studentRoutes(app: FastifyInstance) {

    app.post("/students", StudentController.create)

    app.get("/students", StudentController.findAll)

    app.get("/students/search", StudentController.findStudent)

    app.get("/students/:id", StudentController.findById)

    app.put("/students/:id", StudentController.update)

    app.delete("/students/:id", StudentController.delete)
}