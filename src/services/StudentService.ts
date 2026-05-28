import { PrismaClient } from "@prisma/client"
import { AppError } from "../errors/AppError"

const prisma = new PrismaClient()

export class StudentService {
    private static async generateRegistrationNumber() {
        const lastStudent = await prisma.student.findFirst({
            orderBy: {
                registrationNumber: 'desc'
            },
            select: {
                registrationNumber: true
            }
        })

        const lastNumber = lastStudent
            ? parseInt(lastStudent.registrationNumber)
            : 0

        const nextNumber = lastNumber + 1

        return String(nextNumber).padStart(6, '0')
    }

    static async create(data: any) {
        if (!data.name || !data.email || !data.cpf || !data.birthDate) {
            throw new AppError("Campos obrigatórios ausentes.", 400)
        }

        const registrationNumber = await this.generateRegistrationNumber()

        return await prisma.student.create({
            data: {
                registrationNumber,
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                phone: data.phone,
                birthDate: new Date(data.birthDate)
            }
        })
    }

    static findAll(page: number, limit: number) {
        const skip = (page - 1) * limit

        return Promise.all([
            prisma.student.findMany({
                skip,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.student.count()
        ])
    }

    static async findById(id: string) {
        const student = await prisma.student.findUnique({
            where: { id }
        })

        if (!student) {
            throw new AppError("Aluno não encontrado.", 404)
        }

        return student
    }

    static findStudent(q: string) {
        if (!q || q.trim().length < 2) {
            return []
        }

        return prisma.student.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: 'insensitive'
                        }
                    },
                    {
                        cpf: {
                            contains: q
                        }
                    }
                ]
            },
            orderBy: {
                name: 'asc'
            },
            take: 20
        })
    }

    static async update(id: string, data: any) {
        return await prisma.student.update({
            where: { id },
            data
        })
    }

    static async delete(id: string) {
        return await prisma.student.delete({
            where: { id }
        })
    }
}