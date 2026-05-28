import { FastifyRequest, FastifyReply } from "fastify"
import { PaymentService } from "../services/PaymentService"

function parsePagination(query: unknown) {
    const q = query as { page?: string, limit?: string }
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 10))
    return { page, limit }
}

export class PaymentController {

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = parsePagination(request.query)

        const [data, total] = await PaymentService.findAll(page, limit)

        return reply.send({ data, total, page, limit })
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