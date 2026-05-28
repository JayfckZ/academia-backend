import { EnrollmentService } from "../services/EnrollmentService"

export class EnrollmentController {

    static async create(request: any, reply: any) {
        try {
            const enrollment = await EnrollmentService.create(request.body)
            return reply.send(enrollment)
        } catch (err: any) {
            return reply.status(400).send({
                error: err.message
            })
        }
    }

    static async findAll(request: any, reply: any) {
        const { page = 1, limit = 10 } = request.query

        const [data, total] = await EnrollmentService.findAll(
            Number(page),
            Number(limit)
        )

        return reply.send({
            data,
            total,
            page: Number(page),
            limit: Number(limit)
        })
    }

    static async findById(request: any, reply: any) {
        const { id } = request.params

        const enrollment = await EnrollmentService.findById(id)
        return reply.send(enrollment)
    }

    static async update(request: any, reply: any) {
        const { id } = request.params

        const enrollment = await EnrollmentService.update(id, request.body)
        return reply.send(enrollment)
    }

    static async cancel(request: any, reply: any) {
        const { id } = request.params

        const enrollment = await EnrollmentService.cancel(id)
        return reply.send(enrollment)
    }
}