import { Prisma } from "@prisma/client"
import { AppError } from "../errors/AppError"
import { prisma } from "../lib/prisma"
import { createEmployeeSchema, updateEmployeeSchema } from "../schemas"
import bcrypt from "bcrypt"

const SELECT_SAFE: Prisma.EmployeeSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    active: true,
    createdAt: true
}

export class EmployeeService {

    static async create(data: unknown) {
        const parsed = createEmployeeSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const { name, email, password, role } = parsed.data
        const passwordHash = await bcrypt.hash(password, 10)

        try { 
            return await prisma.employee.create({
                data: { name, email, passwordHash, role },
                select: SELECT_SAFE
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError("Já existe um funcionário com este e-mail.", 409)
            }
            throw error
        }
    }

    static findAll(page: number, limit: number) {
        const skip = (page - 1) * limit

        return Promise.all([
            prisma.employee.findMany({
                skip,
                take: limit,
                orderBy: { name: "asc" },
                select: SELECT_SAFE
            }),
            prisma.employee.count()
        ])
    }

    static async findById(id: string) {
        const employee = await prisma.employee.findUnique({
            where: { id },
            select: SELECT_SAFE
        })

        if (!employee) throw new AppError("Funcionário não encontrado.", 404)

        return employee
    }

    static async update(id: string, data: unknown) {
        const parsed = updateEmployeeSchema.safeParse(data)

        if (!parsed.success) {
            throw new AppError(parsed.error?.issues?.[0]?.message ?? "Dados inválidos.", 400)
        }

        const { password, ...rest } = parsed.data

        const updateData: Prisma.EmployeeUpdateInput = {
            ...Object.fromEntries(
                Object.entries(rest).filter(([, v]) => v !== undefined)
            )
        }

        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10)
        }

        return prisma.employee.update({
            where: { id },
            data: updateData,
            select: SELECT_SAFE
        })
    }

    static delete(id: string) {
        return prisma.employee.update({
            where: { id },
            data: { active: false }
        })
    }
}