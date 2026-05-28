import { FastifyInstance } from "fastify"
import { EnrollmentController } from "../controllers/EnrollmentController"

export async function enrollmentRoutes(app: FastifyInstance) {

    app.post("/enrollments", EnrollmentController.create)

    app.get("/enrollments", EnrollmentController.findAll)

    app.get("/enrollments/:id", EnrollmentController.findById)

    app.put("/enrollments/:id", EnrollmentController.update)

    app.delete("/enrollments/:id", EnrollmentController.cancel)
}