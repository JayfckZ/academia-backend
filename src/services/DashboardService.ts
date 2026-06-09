import { prisma } from "../lib/prisma"

export class DashboardService {
    static async getStats() {
        const now = new Date()
        
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        const [
            activeStudentsCount,
            realizedRevenue,
            expectedRevenue,
            overduePayments,
            expiringEnrollments,
            canceledEnrollments
        ] = await Promise.all([
            prisma.student.count({ where: { status: true } }),

            prisma.payment.aggregate({
                where: { 
                    status: 'PAID', 
                    paidAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } 
                },
                _sum: { amount: true }
            }),

            prisma.payment.aggregate({
                where: { 
                    dueDate: { gte: firstDayOfMonth, lte: lastDayOfMonth } 
                },
                _sum: { amount: true }
            }),

            prisma.payment.aggregate({
                where: { status: 'OVERDUE' },
                _sum: { amount: true },
                _count: { id: true }
            }),

            prisma.enrollment.count({
                where: { 
                    status: 'ACTIVE', 
                    endDate: { gte: now, lte: in30Days } 
                }
            }),

            prisma.enrollment.count({
                where: { 
                    status: 'CANCELED',
                    updatedAt: { gte: firstDayOfMonth, lte: lastDayOfMonth }
                }
            })
        ])

        const realized = Number(realizedRevenue._sum.amount || 0)
        const expected = Number(expectedRevenue._sum.amount || 0)
        const overdueAmount = Number(overduePayments._sum.amount || 0)

        const ticketMedio = activeStudentsCount > 0 ? (realized / activeStudentsCount) : 0

        return {
            activeStudents: activeStudentsCount,
            realizedRevenue: realized,
            expectedRevenue: expected,
            overdueAmount: overdueAmount,
            overdueCount: overduePayments._count.id || 0,
            expiringEnrollments,
            canceledEnrollments,
            ticketMedio
        }
    }
}