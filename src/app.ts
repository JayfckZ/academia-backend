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
import { authRoutes } from './routes/AuthRoute'
import { dashboardRoutes } from './routes/DashboardRoute'

export function buildApp() {
    const app = Fastify({
        ajv: {
            customOptions : {
                strict: false
            }
        }
    })

    app.register(cors, {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    })
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
    app.register(authRoutes)
    app.register(dashboardRoutes)

    return app
}