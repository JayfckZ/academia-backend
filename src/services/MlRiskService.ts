import { prisma } from "../lib/prisma"
import { Payment, PlanDurationType } from "@prisma/client"

type EnrollmentWithRelations = {
    startDate: Date
    student: {
        id: string
        birthDate: Date
    }
    plan: {
        price: number
        duration: number
        durationType: PlanDurationType
    }
    payments: Payment[]
}

type MlStudentPayload = {
    student_id: string
    idade: number
    preco_plano: number
    meses_duracao_plano: number
    meses_desde_matricula: number
    media_dias_atraso: number
    historico_faturas_atrasadas: number
    total_faturas_pagas: number
}

export class MlRiskService {

    static async predictByEnrollment(enrollmentId: string) {
        const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            student: {
            select: { id: true, birthDate: true }
            },
            plan: {
            select: {
                price: true,
                duration: true,
                durationType: true
            }
            },
            payments: true
        }
        })

        if (!enrollment) return null

        const payload = {
        students: [this.buildStudentPayload(enrollment as EnrollmentWithRelations)]
        }

        const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000/predict"

        const response = await fetch(mlServiceUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) return null

        const json = await response.json()
        return json.predictions?.[0] ?? null
    }

    private static buildStudentPayload(
        enrollment: EnrollmentWithRelations
    ): MlStudentPayload {

        const payments = enrollment.payments

        const delays = payments
        .filter((p: Payment) => p.paidAt && p.paidAt > p.dueDate)
        .map((p: Payment) =>
            (p.paidAt!.getTime() - p.dueDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )

        const averageDelay =
        delays.length > 0
            ? delays.reduce((a: number, b: number) => a + b, 0) / delays.length
            : 0

        return {
            student_id: enrollment.student.id,
            idade: this.calculateAge(enrollment.student.birthDate),
            preco_plano: enrollment.plan.price,
            meses_duracao_plano: this.planDurationInMonths(
                enrollment.plan.duration,
                enrollment.plan.durationType
        ),
        meses_desde_matricula: Math.max(
            0,
            Math.floor(
                (Date.now() - enrollment.startDate.getTime()) /
                (1000 * 60 * 60 * 24 * 30)
            )
        ),
        media_dias_atraso: Number(averageDelay.toFixed(2)),
        historico_faturas_atrasadas: payments.filter(
            (p: Payment) => p.status === "OVERDUE"
        ).length,
        total_faturas_pagas: payments.filter(
            (p: Payment) => p.status === "PAID"
        ).length
        }
    }

    private static calculateAge(birthDate: Date) {
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        return age
    }

    private static planDurationInMonths(
        duration: number,
        type: PlanDurationType
    ) {
        if (type === "MONTHS") return duration
        if (type === "WEEKS") return Math.ceil(duration / 4)
        if (type === "DAYS") return Math.ceil(duration / 30)
        return 0
    }
}