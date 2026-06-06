import { FastifyInstance } from "fastify"
import { AppError } from "../errors/AppError"
import { Prisma } from "@prisma/client"

export async function errorHandler(app: FastifyInstance) {

    app.setErrorHandler((error: any, request, reply) => {
        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({
                error: error.message
            })
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return reply.status(409).send({
                    error: "Já existe um registro com estes dados (CPF ou E-mail duplicado)."
                })
            }
            
            if (error.code === "P2025") {
                return reply.status(404).send({
                    error: "Registro não encontrado."
                })
            }
        }

        console.error(error)

        return reply.status(500).send({
            error: "Erro interno no servidor."
        })
    })
}