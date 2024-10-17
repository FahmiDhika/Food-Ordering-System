import express from 'express'
import cors from 'cors'
import produkRoute from './Routers/produkRouter'
import { PORT } from './global'

const app = express()
app.use(cors())

app.use(`/produk`, produkRoute)

app.listen(PORT, () => {
    console.log(`Server run on port http://localhost:${PORT}`)
})