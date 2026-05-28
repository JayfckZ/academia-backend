import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class PaymentService {
    static async createFromEnrollment(enrollmentId: string) {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: {
                plan: true
            }
        })

        if (!enrollment) {
            throw new Error("Matrícula não encontrada")
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
                        include: {
                            student: true,
                            plan: true
                        }
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
                    include: {
                        student: true,
                        plan: true
                    }
                }
            }
        })
    }

    static async markAsPaid(id: string) {
        return prisma.payment.update({
            where: { id },
            data: {
                status: "PAID",
                paidAt: new Date()
            }
        })
    }

    static async markAsOverdue(id: string) {
        return prisma.payment.update({
            where: { id },
            data: {
                status: "OVERDUE"
            }
        })
    }
}