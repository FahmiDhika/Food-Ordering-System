import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"
import { SECRET } from "../global";
import { strict } from "assert";
import { string } from "joi";
import { pseudoRandomBytes } from "crypto";
import { off, traceDeprecation } from "process";

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(403).json({message: `Akses ditolak, tidak ada token yang disediakan`})
    }

    try {
        const secretKey = SECRET || ""
        const decoded = verify(token, secretKey)
        req.body.user = decoded as JwtPayload
        next()
    } catch (error) {
        return res.status(401).json({message: `Token tidak valid`})
    }
}

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.body.user

        if (!user) {
            return res.status(403).json({message: `Tidak ada informasi pengguna yang tersedia`})
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Akses ditolak. Membutuhkan salah satu roles yang ada: ${allowedRoles.join(' ')}`
            })
        }
        next()
    }
}

// hahaha ku tertawa hahaha
// padahal sakit sebenarnya
// bisa bisa nya kau anggap ku bahagia
// tak jelaskah ku kecewa

// barangkali, hujan lebat susah sinyalmu lagi
// ku buat sepuluh kemungkinan
// tak sampaikan pesan
// lelah ketiduran
// atau memang sengaja kau abaikan tapi
// sepertinya ku melihat mu tadi
// dengan kemeja hitam andalan
// benar atau bukan atau hanya dalam pikiran
// rindu ta kesampaian
// mengapa ku tancap gas dan melaju
// padahal lampu kuning tlah peringatkanku
// bahaya didepanku hati hati kecewakan menunggu
// lagu lama yang aku tau

// sayangnya semua tak berjalan
// sedangkan bertahan bukan satu pilihan
// sayangnya kita hanya bisa mengenang
// menikmati hujan lebih indah dari kenyataan