import { FastifyRequest, FastifyReply } from "fastify"
import { EmployeeService } from "../services/EmployeeService"

export class EmployeeController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const employee = await EmployeeService.create(request.body)
        return reply.status(201).send(employee)
    }

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const { page = 1, limit = 10 } = request.query as { page?: number, limit?: number }

        const [data, total] = await EmployeeService.findAll(Number(page), Number(limit))

        return reply.send({ data, total, page: Number(page), limit: Number(limit) })
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