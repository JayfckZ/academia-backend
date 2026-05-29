import { FastifyInstance } from "fastify"
import { PaymentController } from "../controllers/PaymentController"
import { authenticate } from "../plugins/authenticate"

export async function paymentRoutes(app: FastifyInstance) {
    app.addHook("preHandler", authenticate)
    
    app.get("/payments", PaymentController.findAll)
    app.get("/payments/:id", PaymentController.findById)
    app.patch("/payments/:id/pay", PaymentController.markAsPaid)
    app.patch("/payments/:id/overdue", PaymentController.markAsOverdue)
}