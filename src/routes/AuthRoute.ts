import { FastifyInstance } from "fastify"
import { AuthController } from '../controllers/AuthController'

export async function authRoutes(app: FastifyInstance) {
    app.post('/auth/login', AuthController.login)
}