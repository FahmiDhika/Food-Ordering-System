import { NextFunction, Request, Response } from "express";
import Joi, { isSchema } from "joi";

// bikin skema dimana menambahkan user data, semua fields harus diisi

export const addDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid(`CASHIER`, `MANAGER`).required(),
    profile_picture: Joi.allow().optional()
})

export const updateDataSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    role: Joi.string().valid(`CASHIER`, `MANAGER`).optional(),
    profile_picture: Joi.allow().optional()
})

export const verifyAddUser = (request: Request, response: Response, next: NextFunction) => {
    // validasi data dari request body dan mengambil info error jika terdapat error
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        // jika terdapat error, akan memberikan pesan seperti ini
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditUser = (request: Request, response: Response, next: NextFunction) => {
    // validasi data dari request body dan mengambil info error jika terdapat error
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        // jika terdapat error, akan memberikan pesan seperti ini
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}