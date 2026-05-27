import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health'

export function buildApp() {
    const app = Fastify()

    app.register(cors)
    app.register(jwt, {
        secret: 'supersecret'
    })

    app.register(healthRoutes)

    return app
}