import { AppError } from "../errors/AppError"
import { prisma } from "../lib/prisma"
import { createEnrollmentSchema, updateEnrollmentSchema } from "../schemas"
import { PaymentService } from "./PaymentService"

export class EnrollmentService {

    static async create(data: unknown) {
        const parsed = createEnrollmentSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const { studentId, planId, startDate } = parsed.data

        const plan = await prisma.plan.findUnique({ where: { id: planId } })

        if (!plan) throw new AppError("Plano não encontrado.", 404)

        const start = new Date(startDate)
        const endDate = this.calculateEndDate(start, plan.duration, plan.durationType)

        const enrollment = await prisma.enrollment.create({
            data: { studentId, planId, startDate: start, endDate }
        })

        await PaymentService.createFromEnrollment(enrollment.id)

        return enrollment
    }

    static findAll(page: number, limit: number) {
        const skip = (page - 1) * limit

        return Promise.all([
            prisma.enrollment.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { student: true, plan: true }
            }),
            prisma.enrollment.count()
        ])
    }

    static async findById(id: string) {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id },
            include: { student: true, plan: true }
        })

        if (!enrollment) throw new AppError("Matrícula não encontrada.", 404)

        return enrollment
    }

    static async update(id: string, data: unknown) {
        const parsed = updateEnrollmentSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const updateData = Object.fromEntries(
            Object.entries(parsed.data).filter(([, v]) => v !== undefined)
        )

        return prisma.enrollment.update({ where: { id }, data: updateData })
    }

    static cancel(id: string) {
        return prisma.enrollment.update({
            where: { id },
            data: { status: "CANCELED" }
        })
    }

    private static calculateEndDate(startDate: Date, duration: number, type: string) {
        const endDate = new Date(startDate)

        switch (type) {
            case "DAYS":
                endDate.setDate(endDate.getDate() + duration)
                break
            case "WEEKS":
                endDate.setDate(endDate.getDate() + duration * 7)
                break
            case "MONTHS":
                endDate.setMonth(endDate.getMonth() + duration)
                break
        }

        return endDate
    }
}