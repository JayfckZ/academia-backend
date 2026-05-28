import { PrismaClient } from "@prisma/client"
import { AppError } from "../errors/AppError"

const prisma = new PrismaClient()

export class PaymentService {

    static async createFromEnrollment(enrollmentId: string) {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { plan: true }
        })

        if (!enrollment) {
            throw new AppError("Matrícula não encontrada.", 404)
        }

        return prisma.payment.create({
            data: {
                enrollmentId: enrollment.id,
                amount: enrollment.plan.price,
                dueDate: enrollment.startDate,
                status: "PENDING"
            }
        })
    }

    static findAll(page: number, limit: number) {
        const skip = (page - 1) * limit

        return Promise.all([
            prisma.payment.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    enrollment: {
                        include: { student: true, plan: true }
                    }
                }
            }),
            prisma.payment.count()
        ])
    }

    static findById(id: string) {
        return prisma.payment.findUnique({
            where: { id },
            include: {
                enrollment: {
                    include: { student: true, plan: true }
                }
            }
        })
    }

    static markAsPaid(id: string) {
        return prisma.payment.update({
            where: { id },
            data: { status: "PAID", paidAt: new Date() }
        })
    }

    static markAsOverdue(id: string) {
        return prisma.payment.update({
            where: { id },
            data: { status: "OVERDUE" }
        })
    }
}