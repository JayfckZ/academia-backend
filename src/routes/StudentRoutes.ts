import { FastifyInstance } from "fastify"
import { StudentController } from "../controllers/StudentController"
import { authenticate } from "../plugins/authenticate"

export async function studentRoutes(app: FastifyInstance) {
    app.addHook("preHandler", authenticate)
    
    app.post("/students", StudentController.create)
    app.get("/students", StudentController.findAll)
    app.get("/students/search", StudentController.findStudent)
    app.get("/students/:id", StudentController.findById)
    app.put("/students/:id", StudentController.update)
    app.delete("/students/:id", StudentController.delete)
}