import { AppError } from "../errors/AppError"
import { prisma } from "../lib/prisma"

export class PaymentService {

    static async createFromEnrollment(enrollmentId: string) {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { plan: true }
        })

        if (!enrollment) throw new AppError("Matrícula não encontrada.", 404)

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

    static async findById(id: string) {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                enrollment: {
                    include: { student: true, plan: true }
                }
            }
        })

        if (!payment) throw new AppError("Pagamento não encontrado.", 404)

        return payment
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