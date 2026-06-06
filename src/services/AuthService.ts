import bcrypt from 'bcrypt'
import { AppError } from "../errors/AppError"
import { prisma } from "../lib/prisma"

export class AuthService {
    static async login(email: string, password: string) {
        const employee = await prisma.employee.findUnique({ where: { email } })

        if (!employee || !employee.active) {
            throw new AppError('Credenciais inválidas.', 401)
        }

        const valid = await bcrypt.compare(password, employee.passwordHash)

        if (!valid) {
            throw new AppError('Credenciais inválidas.', 401)
        }

        return {
            id: employee.id,
            name: employee.name,
            role: employee.role
        }
    }
}