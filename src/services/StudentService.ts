import { Prisma } from "@prisma/client"
import { AppError } from "../errors/AppError"
import { prisma } from "../lib/prisma"
import { createStudentSchema, updateStudentSchema } from "../schemas"

export class StudentService {
    private static async generateRegistrationNumber(): Promise<string> {
        while (true) {
            const lastStudent = await prisma.student.findFirst({
                orderBy: { registrationNumber: "desc" },
                select: { registrationNumber: true }
            })

            const lastNumber = lastStudent
                ? parseInt(lastStudent.registrationNumber)
                : 0

            const registrationNumber = String(lastNumber + 1).padStart(6, "0")

            const exists = await prisma.student.findUnique({
                where: { registrationNumber }
            })

            if (!exists) return registrationNumber
        }
    }

    static async create(data: unknown) {
        const parsed = createStudentSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const { name, email, cpf, birthDate, phone } = parsed.data

        const registrationNumber = await this.generateRegistrationNumber()

        return prisma.student.create({
            data: {
                registrationNumber,
                name,
                email,
                cpf,
                birthDate: new Date(birthDate),
                ...(phone !== undefined && { phone })
            }
        })
    }

    static findAll(page: number, limit: number) {
        const skip = (page - 1) * limit

        return Promise.all([
            prisma.student.findMany({
                skip,
                take: limit,
                orderBy: { name: "asc" }
            }),
            prisma.student.count()
        ])
    }

    static async findById(id: string) {
        const student = await prisma.student.findUnique({ where: { id } })

        if (!student) throw new AppError("Aluno não encontrado.", 404)

        return student
    }

    static findStudent(q: string) {
        if (!q || q.trim().length < 2) return []

        return prisma.student.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { cpf: { contains: q } }
                ]
            },
            orderBy: { name: "asc" },
            take: 20
        })
    }

    static async update(id: string, data: unknown) {
        const parsed = updateStudentSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const { birthDate, ...rest } = parsed.data

        const updateData: Prisma.StudentUpdateInput = {
            ...Object.fromEntries(
                Object.entries(rest).filter(([, v]) => v !== undefined)
            ),
            ...(birthDate && { birthDate: new Date(birthDate) })
        }

        return prisma.student.update({ where: { id }, data: updateData })
    }

    static delete(id: string) {
        return prisma.student.delete({ where: { id } })
    }
}