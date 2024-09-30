import { NextFunction, Request, Response } from "express";
import Joi, { isSchema } from "joi";

// bikin skema dimana menambahkan menu data, semua fields harus diisi

export const addDataSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid(`FOOD`, `DRINK`, `SNACK`).required(),
    description: Joi.string().required(),
    picture: Joi.allow().optional()
})

export const updateDataSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().valid(`FOOD`, `DRINK`, `SNACK`).optional(),
    description: Joi.string().optional(),
    picture: Joi.allow().optional()
})

export const verifyAddMenu = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditMenu = (request: Request, response: Response, next: NextFunction) => {
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