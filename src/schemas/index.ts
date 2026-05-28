import { z } from "zod"
import { EmployeeRole } from "@prisma/client"

export const createStudentSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
    birthDate: z.string().refine(d => !isNaN(Date.parse(d)), "Data inválida"),
    phone: z.string().optional()
})

export const updateStudentSchema = createStudentSchema.partial()

export const createPlanSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    price: z.number().positive("Preço deve ser positivo"),
    duration: z.number().int().positive("Duração deve ser positiva"),
    durationType: z.enum(["DAYS", "WEEKS", "MONTHS"], {
        errorMap: () => ({ message: "Tipo deve ser DAYS, WEEKS ou MONTHS" })
    })
})

export const updatePlanSchema = createPlanSchema.partial()

export const createEnrollmentSchema = z.object({
    studentId: z.string().min(1, "studentId é obrigatório"),
    planId: z.string().min(1, "planId é obrigatório"),
    startDate: z.string().refine(d => !isNaN(Date.parse(d)), "Data inválida")
})

export const updateEnrollmentSchema = createEnrollmentSchema.partial()

export const createEmployeeSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    role: z.nativeEnum(EmployeeRole)
})

export const updateEmployeeSchema = createEmployeeSchema.partial()