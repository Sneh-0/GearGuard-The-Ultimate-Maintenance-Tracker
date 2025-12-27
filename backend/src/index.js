import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import equipmentRouter from './routes/equipment.js'
import maintenanceRouter from './routes/maintenance.js'
import authRouter from './routes/auth.js'
import teamsRouter from './routes/teams.js'
import calendarRouter from './routes/calendar.js'
import reportsRouter from './routes/reports.js'
import usersRouter from './routes/users.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

app.use('/api/equipment', equipmentRouter)
app.use('/api/maintenance-requests', maintenanceRouter)
app.use('/api/auth', authRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/users', usersRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(port, () => {
  console.log(`GearGuard backend listening on port ${port}`)
})
