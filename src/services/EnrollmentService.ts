import { PrismaClient } from "@prisma/client"
import { PaymentService } from "./PaymentService"

const prisma = new PrismaClient()

export class EnrollmentService {

    static async create(data: any) {
        const plan = await prisma.plan.findUnique({
            where: { id: data.planId }
        })

        if (!plan) {
            throw new Error("Plano não encontrado")
        }

        const startDate = new Date(data.startDate)

        const endDate = this.calculateEndDate(
            startDate,
            plan.duration,
            plan.durationType
        )

        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: data.studentId,
                planId: data.planId,
                startDate,
                endDate
            }
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
                include: {
                    student: true,
                    plan: true
                }
            }),
            prisma.enrollment.count()
        ])
    }

    static findById(id: string) {
        return prisma.enrollment.findUnique({
            where: { id },
            include: {
                student: true,
                plan: true
            }
        })
    }

    static update(id: string, data: any) {
        return prisma.enrollment.update({
            where: { id },
            data
        })
    }

    static cancel(id: string) {
        return prisma.enrollment.update({
            where: { id },
            data: {
                status: "CANCELED"
            }
        })
    }

    private static calculateEndDate(
        startDate: Date,
        duration: number,
        type: string
    ) {
        const endDate = new Date(startDate)

        switch (type) {
            case "DAYS":
                endDate.setDate(endDate.getDate() + duration)
                break

            case "WEEKS":
                endDate.setDate(endDate.getDate() + (duration * 7))
                break

            case "MONTHS":
                endDate.setMonth(endDate.getMonth() + duration)
                break
        }

        return endDate
    }
}