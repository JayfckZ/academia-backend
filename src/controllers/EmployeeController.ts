import { EmployeeService } from '../services/EmployeeService'

export class EmployeeController {
    static async create(request: any, reply: any) {
        const employee = await EmployeeService.create(request.body)
        return reply.send(employee)
    }

    static async findAll(request: any, reply: any) {
        const { page = 1, limit = 10 } = request.query

        const [data, total] = await EmployeeService.findAll(
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

        const employee = await EmployeeService.findById(id)
        return reply.send(employee)
    }

    static async update(request: any, reply: any) {
        const { id } = request.params

        const employee = await EmployeeService.update(id, request.body)
        return reply.send(employee)
    }

    static async delete(req: any, reply: any) {
        const { id } = req.params

        await EmployeeService.delete(id)
        return reply.send({ message: "Funcionário deletado com sucesso." })
    }

}