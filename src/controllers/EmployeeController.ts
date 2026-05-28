import { FastifyRequest, FastifyReply } from "fastify"
import { EmployeeService } from "../services/EmployeeService"

function parsePagination(query: unknown) {
    const q = query as { page?: string, limit?: string }
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(q.limit) || 10))
    return { page, limit }
}

export class EmployeeController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const employee = await EmployeeService.create(request.body)
        return reply.status(201).send(employee)
    }

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = parsePagination(request.query)

        const [data, total] = await EmployeeService.findAll(page, limit)

        return reply.send({ data, total, page, limit })
    }

    static async findById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const employee = await EmployeeService.findById(id)
        return reply.send(employee)
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const employee = await EmployeeService.update(id, request.body)
        return reply.send(employee)
    }

    static async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        await EmployeeService.delete(id)
        return reply.send({ message: "Funcionário deletado com sucesso." })
    }
}