import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health'
import { studentRoutes } from './routes/students'

export function buildApp() {
    const app = Fastify()

    app.register(cors)
    app.register(jwt, {
        secret: 'supersecret'
    })

    app.register(healthRoutes)
    app.register(studentRoutes)

    return app
}