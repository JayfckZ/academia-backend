import { PaymentService } from "../services/PaymentService"

export class PaymentController {

    static async findAll(request: any, reply: any) {
        const { page = 1, limit = 10 } = request.query

        const [data, total] = await PaymentService.findAll(
            Number(page),
            Number(limit)
        )

        return reply.send({
            data,
            total,
            page: Number(page),
            limit
        })
    }

    static async findById(request: any, reply: any) {
        const { id } = request.params

        const payment = await PaymentService.findById(id)
        return reply.send(payment)
    }

    static async markAsPaid(request: any, reply: any) {
        const { id } = request.params

        const payment = await PaymentService.markAsPaid(id)
        return reply.send(payment)
    }

    static async markAsOverdue(request: any, reply: any) {
        const { id } = request.params

        const payment = await PaymentService.markAsOverdue(id)
        return reply.send(payment)
    }
}