import { FastifyRequest, FastifyReply } from "fastify"
import { StudentService } from "../services/StudentService"

function parsePagination(query: unknown) {
    const q = query as { page?: string, limit?: string }
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 10))
    return { page, limit }
}

export class StudentController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const student = await StudentService.create(request.body)
        return reply.status(201).send(student)
    }

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = parsePagination(request.query)

        const [data, total] = await StudentService.findAll(page, limit)

        return reply.send({ data, total, page, limit })
    }

    static async findStudent(request: FastifyRequest, reply: FastifyReply) {
        const { q } = request.query as { q: string }

        const students = await StudentService.findStudent(q)

        return reply.send(students)
    }

    static async findById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const student = await StudentService.findById(id)

        return reply.send(student)
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const student = await StudentService.update(id, request.body)

        return reply.send(student)
    }

    static async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        await StudentService.delete(id)

        return reply.send({ message: "Aluno deletado com sucesso." })
    }
}