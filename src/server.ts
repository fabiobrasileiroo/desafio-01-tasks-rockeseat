import express from 'express'
import tasksRouter from './routes/tasks.routes'

export const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (_req,res) => {
  res.send('Funcionando')
})

app.use('/',tasksRouter)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})