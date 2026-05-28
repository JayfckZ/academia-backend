import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class PlanService {

    static create(data: any) {
        return prisma.plan.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                durationType: data.durationType
            }
        })
    }

    static findAll() {
        return prisma.plan.findMany({
            orderBy: { name: "asc" },
            where: {
                active: true
            }
        })
    }

    static findById(id: string) {
        return prisma.plan.findUnique({
            where: { id }
        })
    }

    static update(id: string, data: any) {
        return prisma.plan.update({
            where: { id },
            data
        })
    }

    static delete(id: string) {
        return prisma.plan.update({
            where: { id },
            data: {
                active: false
            }
        })
    }
}