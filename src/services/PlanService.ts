import { Prisma } from "@prisma/client"
import { AppError } from "../errors/AppError"
import { prisma } from "../lib/prisma"
import { createPlanSchema, updatePlanSchema } from "../schemas"

export class PlanService {

    static async create(data: unknown) {
        const parsed = createPlanSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        return prisma.plan.create({
            data: {
                name: parsed.data.name,
                price: parsed.data.price,
                duration: parsed.data.duration,
                durationType: parsed.data.durationType,
                description: parsed.data.description ?? null
            }
        })
    }

    static findAll() {
        return prisma.plan.findMany({
            orderBy: { name: "asc" },
            where: { active: true }
        })
    }

    static async findById(id: string) {
        const plan = await prisma.plan.findUnique({ where: { id } })

        if (!plan) throw new AppError("Plano não encontrado.", 404)

        return plan
    }

    static async update(id: string, data: unknown) {
        const parsed = updatePlanSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const updateData: Prisma.PlanUpdateInput = {
            ...Object.fromEntries(
                Object.entries(parsed.data).filter(([, v]) => v !== undefined)
            )
        }

        return prisma.plan.update({ where: { id }, data: updateData })
    }

    static delete(id: string) {
        return prisma.plan.update({
            where: { id },
            data: { active: false }
        })
    }
}