import { StudentService } from "../services/StudentService"

export class StudentController {

    static async create(request: any, reply: any) {
        const student = await StudentService.create(request.body)
        return reply.send(student)
    }

    static async findAll(request: any, reply: any) {
        const { page = 1, limit = 10 } = request.query

        const [data, total] = await StudentService.findAll(
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

    static async findStudent(request: any, reply: any) {
        const { q } = request.query

        const students = await StudentService.findStudent(q)

        return reply.send(students)
    }

    static async findById(request: any, reply: any) {
        const { id } = request.params

        const student = await StudentService.findById(id)

        return reply.send(student)
    }

    static async update(request: any, reply: any) {
        const { id } = request.params

        const student = await StudentService.update(id, request.body)

        return reply.send(student)
    }

    static async delete(request: any, reply: any) {
        const { id } = request.params

        await StudentService.delete(id)

        return reply.send({ message: "Deletado com sucesso." })
    }
}