import { FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "../services/AuthService"

export class AuthController {
    static async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as { email: string, password: string }

        const employee = await AuthService.login(email, password)

        const token = await reply.jwtSign(
            { id: employee.id, role: employee.role },
            { expiresIn: '8h' }
        )

        return reply.send({ token, name: employee.name, role: employee.role})
    }
}