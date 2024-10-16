import { Request, Response } from "express";
import { PrismaClient, status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const getAllOrder = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allOrder = await prisma.order.findMany({
            where: {customer: {contains: search?.toString() || ""}}
        })

        return response.json({
            status: true,
            data: allOrder,
            message: `Order berhasil ditampilkan`
        }).status(200)
    } catch(error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan. ${error}`
        }).status(200)
    }
}

export const newOrder = async (request: Request, response: Response) => {
    try {
        
    } catch(error) {
        
    }
}