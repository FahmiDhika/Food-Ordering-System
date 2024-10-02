import path from "path";

// definisikan path (alamat) dari folder "root"

export const BASE_URL = `${path.join(__dirname, "../")}`
export const PORT = process.env.PORT
export const SECRET = process.env.SECRET