import { Request, Response } from "express";
import { PrismaClient, status } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import { BASE_URL, SECRET } from "../global";
import fs, { stat } from "fs";
import md5 from "md5" // autentikasi
import { sign } from "jsonwebtoken"; // memberikan token untuk login

const prisma = new PrismaClient({errorFormat: "pretty"})

export const getAllUser = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allUser = await prisma.user.findMany({
            where: {
                name: {contains: search?.toString() || ""}
            }
        })

        return response.json({
            status: true,
            data: allUser,
            message: `User berhasil ditampilkan`
        })
    } catch(error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const createUser = async (request: Request, response: Response) => {
    try {
        // mendapatkan request data dari body
        const { name, email, password, role } = request.body
        const uuid = uuidv4()

        // proses menyimpan user
        const newUser = await prisma.user.create({
            data: { uuid, name, email, password: md5(password), role }
        })

        return response.json({
            status: true,
            data: newUser,
            message: `User berhasil ditambahkan`
        }).status(200)
    } catch(error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { name, email, password, role } = request.body

        const findUser = await prisma.user.findFirst({where: { idUser: Number(id) } })
        if (!findUser) return response.status(200).json({
            status: false,
            message: `User tidak ditemukan`
        })

        const updateUser = await prisma.user.update({
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: password ? md5(password) : findUser.password,
                role: role || findUser.role
            },
            where: { idUser: Number(id)}
        })

        return response.json({
            status: true,
            data: updateUser,
            message: `User berhasil di update`
        }).status(200)
    } catch(error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const changeProfile = async (request: Request, response: Response) => {
    try {
        const { id } = request.params // mendapatkan id user yang dikirimkan melalui parameter
    
        // id dicek apakah ada tau tidak
        const findUser = await prisma.user.findFirst({ where: { idUser: Number(id) }})

        if (!findUser) return response.status(200).json({
            status: false,
            message: `User tidak ditemukan`
        })

        // default value untuk filename
        let filename = findUser.profile_picture

        if (request.file) {
            // update nama file dari foto yang di upload
            filename = request.file.filename
            
            // cek foto yang lama di dalam folder
            let path = `${BASE_URL}../public/profile_picture/${findUser.profile_picture}`
            let exists = fs.existsSync(path)

            // hapus foto yang lama jika di upload file baru
            if (exists && findUser.profile_picture !== ``) fs.unlinkSync(path) // unlinksync untuk menghapus file tersebut
        }

        const updatePicture = await prisma.user.update({
            data: { profile_picture: filename },
            where: { idUser: Number(id) }
        })

        return response.json({
            status: true,
            data: updatePicture,
            messgae: `Foto Telah Diubah`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `there is an error ${error}`
        }).status(400)
    }
}

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findUser = await prisma.user.findFirst({where: { idUser: Number(id) } })
        if (!findUser) return response.status(200).json({
            status: false,
            message: `User tidak ditemukan`
        })

        // cek foto di dalam folder
        let path = `${BASE_URL}../public/profile_picture/${findUser.profile_picture}`
        let exists = fs.existsSync(path)

        // hapus foto yang lama jika file baru di upload
        if(exists && findUser.profile_picture !== ``) fs.unlinkSync(path)

        const deleteUser = await prisma.user.delete({
            where: { idUser: Number(id) }
        })

        return response.json({
            status: true,
            data: deleteUser,
            message: `User berhasil dihapus`
        }).status(200)
    } catch(error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body
        
        const findUser = await prisma.user.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findUser) return response.status(200).json({
            status: false,
            logged: false,
            message: `Email atau Password invalid`
        })

        let data = {
            id: findUser.idUser,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role
        }

        // menyiapkan data yang akan dijadikan token
        let payload = JSON.stringify(data)

        // sign untuk generate token
        let token = sign(payload, SECRET || "token")

        return response.status(200).json({
            status: true,
            logged: true,
            message: `Login sukses`,
            token
        })

    } catch(error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
    
}