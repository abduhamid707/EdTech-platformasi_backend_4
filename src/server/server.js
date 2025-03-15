import '../utils/db.js'
import express from 'express'
import cors from 'cors'
import indexRouter from '../Models/index.routes.js'
import errorMiddleware from '../middleware/errorHandler.js'
import authRoutes from '../Models/Admin/auth.routes.js'

const app = express()

app.use(cors('*'))
app.use(express.json())
app.use('/api', indexRouter)
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);
app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
