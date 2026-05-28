import { FastifyInstance } from 'fastify'
import { StudentService } from '../services/students'

export async function studentRoutes(app: FastifyInstance) {
    app.post('/students', async (request, reply) => {
        const student = await StudentService.create(request.body)
    })

    app.get('/students', async (request) => {
        const { page = 1, limit = 10 } = request.query as any

        const [data, total] = await StudentService.findAll(
            Number(page),
            Number(limit)
        )

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / Number(limit))
        }
    })

    app.get('/students/:id', async (request, reply) => {
        const { id } = request.params as any
        
        const student = await StudentService.findById(id)

        return reply.send(student)
    })

    app.get('/students/search', async (request, reply) => {
        const { q } = request.query as any

        const students = await StudentService.findStudent(q)

        return reply.send(students)
    })

    app.put('/students/:id', async (request, reply) => {
        const { id } = request.params as any

        const student = await StudentService.update(id, request.body)

        return reply.send(student)
    })

    app.delete('/students/:id', async (request, reply) => {
        const { id } = request.params as any

        await StudentService.delete(id)

        return reply.send({ message: 'Deletado com sucesso'})
    })
}