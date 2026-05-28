import { FastifyRequest, FastifyReply } from "fastify"
import { PlanService } from "../services/PlanService"

export class PlanController {

    static async create(request: FastifyRequest, reply: FastifyReply) {
        const plan = await PlanService.create(request.body)
        return reply.status(201).send(plan)
    }

    static async findAll(request: FastifyRequest, reply: FastifyReply) {
        const data = await PlanService.findAll()
        return reply.send(data)
    }

    static async findById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const plan = await PlanService.findById(id)
        return reply.send(plan)
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        const plan = await PlanService.update(id, request.body)
        return reply.send(plan)
    }

    static async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }

        await PlanService.delete(id)
        return reply.send({ message: "Plano deletado." })
    }
}