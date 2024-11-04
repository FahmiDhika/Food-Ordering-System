import { Request } from "express";
import multer from "multer";
import { BASE_URL } from "../global"

// definisikan konfigurasi penyimpanan dari foto user
const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // deifinisikan lokasi dari foto yang diupload, pastikan sudah membuat folder "public" di root folder
        // lalu buat folder "user_picture" di dalam "public" folder
        cb(null, `${BASE_URL}/public/profile_picture/`)
    },
    
    filename: (request:Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // definisikan nama file yang diupload
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
    }
})

const uploadFile = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // definisikan besar file maksimal yang bisa di upload, disini maksimalnya 2mb
})

export default uploadFile