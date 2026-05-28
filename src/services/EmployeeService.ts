import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export class EmployeeService {
    static async create(data: any) {
        const passwordHash = await bcrypt.hash(data.password, 10)

        return prisma.employee.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: data.role
            }
        })
    }

    static findAll(page: number, limit: number) {
        const skip = (page - 1) * limit

        return Promise.all([
            prisma.employee.findMany({
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    active: true,
                    createdAt: true
                }
            }),
            prisma.employee.count()
        ])
    }

    static findById(id: string) {
        return prisma.employee.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
                createdAt: true
            }
        })
    }

    static async update(id: string, data: any) {
        const updatedData: any = {
            name: data.name,
            email: data.email,
            role: data.role,
            active: data.active
        }

        if (data.password) {
            updatedData.passwordHash = await bcrypt.hash(data.password, 10)
        }
        
        return prisma.employee.update({
            where: { id },
            data: updatedData
        })
    }

    static delete(id: string) {
        return prisma.employee.delete({
            where: { id }
        })
    }


}