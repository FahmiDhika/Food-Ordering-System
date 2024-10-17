import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient({errorFormat: "pretty"})

export const getAllProduk = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allMenus = await prisma.produk.findMany({
            where: { namaProduk: {contains: search?.toString() || "" } }
        })
        /** contains berarti mencari nama menunya dari menu berdasarkan keyword yang dikirimkan */
        // output
        return response.json({
            status: true,
            data: allMenus,
            massage: `Produk berhasil ditampilkan`
        }).status(200)
    } catch (error) {
        return response
        .json({
            status: false,
            massage: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}

export const newProduk = async (request: Request, response: Response) => {
    try {
        const { namaProduk, harga} = request.body
        const uuid = uuidv4()

        const newProduk = await prisma.produk.create({
            data: { uuid, namaProduk, harga: Number(harga) }
        })

        return response.json({
            status: true,
            data: newProduk,
            message: `Berhasil menambahkan produk baru`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}

export const updateProduk = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { namaProduk, harga } = request.body

        const findProduk = await prisma.produk.findFirst({where: { id: Number(id)}})
        if (!findProduk) return response.status(200).json({
            status: false,
            message: `Produk tidak ditemukan`
        })

        const updateProduk = await prisma.produk.update({
            data: {
                namaProduk: namaProduk || findProduk.namaProduk,
                harga: harga ? Number(harga) : findProduk.harga
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateProduk,
            message: `Produk berhasil ditampilkan`
        }).status(400)
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}

export const deleteProduk = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findProduk = await prisma.produk.findFirst({where: { id: Number(id)}})
        if (!findProduk) return response.status(200).json({
            status: false,
            message: `Produk tidak ditemukan`
        })

        const deleteProduk = await prisma.produk.delete({
            where: { id: Number(id)}
        })

        return response.json({
            status: true,
            data: deleteProduk,
            message: `Produk berhasil dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}