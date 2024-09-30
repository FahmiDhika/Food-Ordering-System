import { Request, Response } from "express";
import { PrismaClient, status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import { request } from "http";
import { date, number } from "joi";
import { json } from "stream/consumers";

const prisma = new PrismaClient({errorFormat: "pretty"})

export const getAllMenus = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allMenus = await prisma.menu.findMany({
            where: { name: {contains: search?.toString() || "" } }
        })
        /** contains berarti mencari nama menunya dari menu berdasarkan keyword yang dikirimkan */
        // output
        return response.json({
            status: true,
            data: allMenus,
            massage: `Menu berhasil ditampilkan`
        }).status(200)
    } catch (error) {
        return response
        .json({
            status: false,
            massage: `Terjadi sebuah kesalahan. ${error}`
        }).status(400)
    }
}

export const createMenu = async (request: Request, response: Response) => {
    try {
        // mendapatkan request data (data dikirim dari request body)
        const { name, price, category, description } = request.body
        const uuid = uuidv4()

        // proses untuk menyimpan menu
        const newMenu = await prisma.menu.create({
            data: { uuid, name, price: Number(price), category, description }
        })
        // harga dan stok telah diubah menjadi INTEGER, default nya STRING

        return response.json({
            status: true,
            data: newMenu,
            massage: `Menu Telah Berhasil Ditambahkan`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            massage: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const updateMenu = async (request: Request, response: Response) => {
    try {
        const { id } = request.params // mendapatkan id menu yang dikirimkan melalui parameter
        const { name, price, category, description } = request.body // mendapatkan request data dari body

        // memastikan data ada di database
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return response.status(200).json({
            status: false,
            message: `Menu tidak ditemukan`
        })

        // proses untuk mengupdate data dari menu
        const updateMenu = await prisma.menu.update({
            data: {
                name: name || findMenu.name,
                price: price ? Number(price) : findMenu.price, //ini merupakan operasi ternary, `kondisi ? true : false`
                category: category || findMenu.category,
                description: description || findMenu.description
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateMenu,
            message: `Menu berhasil di update`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            massage: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    } 
}

export const deleteMenu = async (request: Request, response: Response) => {
    try {
        const { id } = request.params // mendapatkan id menu yang dikirimkan melalui parameter
        
        // id dicek apakah ada tau tidak
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) }})
        if (!findMenu) return response.status(200).json({
            status: false,
            message: `Menu tidak ditemukan`
        })

        // proses untuk delete data
        const deleteMenu = await prisma.menu.delete({
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: deleteMenu,
            message: `Menu berhasil dihapus`
        }).status(200)
    } catch(error) {
        return response.json({
            status: false,
            message: `there is an error ${error}`
        }).status(400)
    }
}