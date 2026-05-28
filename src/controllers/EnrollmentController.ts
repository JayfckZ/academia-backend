import { FastifyRequest, FastifyReply } from "fastify"
import { EnrollmentService } from "../services/EnrollmentService"

export class EnrollmentController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const enrollment = await EnrollmentService.create(request.body)
        return reply.status(201).send(enrollment)
    }

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page = 1, limit = 10 } = request.query as { page?: number, limit?: number }

        const [data, total] = await EnrollmentService.findAll(Number(page), Number(limit))

        return reply.send({ data, total, page: Number(page), limit: Number(limit) })
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