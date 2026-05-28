import { FastifyRequest, FastifyReply } from "fastify"
import { PaymentService } from "../services/PaymentService"

export class PaymentController {

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page = 1, limit = 10 } = request.query as { page?: number, limit?: number }

        const [data, total] = await PaymentService.findAll(Number(page), Number(limit))

        return reply.send({ data, total, page: Number(page), limit: Number(limit) })
    }

    static async findById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const payment = await PaymentService.findById(id)
        return reply.send(payment)
    }

    static async markAsPaid(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const payment = await PaymentService.markAsPaid(id)
        return reply.send(payment)
    }

    static async markAsOverdue(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const payment = await PaymentService.markAsOverdue(id)
        return reply.send(payment)
    }
}