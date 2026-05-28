import { FastifyRequest, FastifyReply } from "fastify"
import { EnrollmentService } from "../services/EnrollmentService"

function parsePagination(query: unknown) {
    const q = query as { page?: string, limit?: string }
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 10))
    return { page, limit }
}

export class EnrollmentController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const enrollment = await EnrollmentService.create(request.body)
        return reply.status(201).send(enrollment)
    }

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = parsePagination(request.query)

        const [data, total] = await EnrollmentService.findAll(page, limit)

        return reply.send({ data, total, page, limit })
    }

    static async findById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const enrollment = await EnrollmentService.findById(id)
        return reply.send(enrollment)
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const enrollment = await EnrollmentService.update(id, request.body)
        return reply.send(enrollment)
    }

    static async cancel(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const enrollment = await EnrollmentService.cancel(id)
        return reply.send(enrollment)
    }
}