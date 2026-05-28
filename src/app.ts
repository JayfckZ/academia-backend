import Fastify from 'fastify'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health'
import { studentRoutes } from './routes/StudentRoutes'
import { employeeRoutes } from "./routes/EmployeeRoutes"
import { planRoutes } from './routes/PlanRoutes'
import { enrollmentRoutes } from './routes/EnrollmentRoutes'
import { paymentRoutes } from './routes/PaymentRoutes'
import { errorHandler } from './plugins/errorHandler'

export function buildApp() {
    const app = Fastify()

    app.register(cors)
    app.register(jwt, {
        secret: 'supersecret'
    })
    app.register(errorHandler)

    app.register(healthRoutes)
    app.register(studentRoutes)
    app.register(employeeRoutes)
    app.register(planRoutes)
    app.register(enrollmentRoutes)
    app.register(paymentRoutes)

    return app
}