import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import md5 from "md5"

const prisma = new PrismaClient({errorFormat: "pretty"})

export const newAdmin = async (request: Request, response: Response) => {
    try {
        const { nama, password } = request.body
        const uuid = uuidv4()

        const newAdmin = await prisma.admin.create({
            data: { uuid, nama, password: md5(password) }
        })

        return response.json({
            status: true,
            data: newAdmin,
            message: `Admin Baru Berhasil Dibuat`
        }).status(200)
    } catch (error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}