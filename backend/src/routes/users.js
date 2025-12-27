mport { Router } from 'express'
import { getCollection } from '../db.js'

const router = Router()

router.get('/technicians', async (req, res, next) => {
  try {
    const col = await getCollection('users')
    const users = await col.find({ role: 'Technician' }).project({ email: 1, name: 1, _id: 0 }).toArray()
    res.json(users)
  } catch (e) { next(e) }
})

export default router
