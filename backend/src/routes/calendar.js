import { Router } from 'express'
import { getCollection } from '../db.js'

const router = Router()

router.get('/events', async (req, res, next) => {
  try {
    const col = await getCollection('calendar_events')
    const docs = await col.find({}).sort({ date: 1 }).toArray()
    res.json(docs.map(d => ({ id: d._id?.toString?.() || '', title: d.title, date: d.date, equipmentId: d.equipmentId })))
  } catch (e) { next(e) }
})

export default router
