import { FastifyRequest, FastifyReply } from "fastify"
import { DashboardService } from "../services/DashboardService"

export class DashboardController {
    static async getStats(request: FastifyRequest, reply: FastifyReply) {
        const stats = await DashboardService.getStats()
        return reply.send(stats)
    }
}