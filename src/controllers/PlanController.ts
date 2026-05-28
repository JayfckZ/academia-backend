import { PlanService } from "../services/PlanService"

export class PlanController {

    static async create(request: any, reply: any) {
        const plan = await PlanService.create(request.body)
        return reply.send(plan)
    }

    static async findAll(request: any, reply: any) {
        const data = await PlanService.findAll()
        return reply.send(data)
    }

    static async findById(request: any, reply: any) {
        const { id } = request.params

        const plan = await PlanService.findById(id)
        return reply.send(plan)
    }

    static async update(request: any, reply: any) {
        const { id } = request.params

        const plan = await PlanService.update(id, request.body)
        return reply.send(plan)
    }

    static async delete(request: any, reply: any) {
        const { id } = request.params

        const plan = await PlanService.delete(id)
        return reply.send({ message: "Plano deletado." })
    }
}