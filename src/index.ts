import express from 'express'
import cors from 'cors'
import MenuRoute from './routers/menuRoute'
import userRoute from './routers/userRoute'
import { PORT } from './global'

const app = express()
app.use(cors())

app.use(`/menu`, MenuRoute)
app.use(`/user`, userRoute)

app.listen(PORT, () => {
    console.log(`Server run on port http://localhost:${PORT}`)
})