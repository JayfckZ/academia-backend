import { FastifyInstance } from "fastify"
import { AppError } from "../errors/AppError"

export async function errorHandler(app: FastifyInstance) {

    app.setErrorHandler((error: any, request, reply) => {
        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({
                error: error.message
            })
        }

        if (error.code === "P2002") {
            return reply.status(409).send({
                error: "Já existe um registro com esses dados."
            })
        }

        if (error.code === "P2025") {
            return reply.status(404).send({
                error: "Registro não encontrado."
            })
        }

        console.error(error)

        return reply.status(500).send({
            error: "Erro interno no servidor."
        })
    })
}