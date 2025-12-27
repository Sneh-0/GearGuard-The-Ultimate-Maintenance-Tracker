import { Router } from 'express'
import { getCollection, ObjectId } from '../db.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const col = await getCollection('equipment')
    const docs = await col.find({}).sort({ _id: 1 }).toArray()
    res.json(docs.map(d => ({
      id: d._id.toString(),
      name: d.name,
      type: d.type,
      location: d.location,
      status: d.status,
      lastMaintenance: d.lastMaintenance,
      maintenanceSchedule: d.maintenanceSchedule
    })))
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, type, location, maintenanceSchedule } = req.body
    const col = await getCollection('equipment')
    const doc = {
      name,
      type,
      location,
      status: 'Operational',
      lastMaintenance: new Date().toISOString().split('T')[0],
      maintenanceSchedule
    }
    const result = await col.insertOne(doc)
    res.status(201).json({
      id: result.insertedId.toString(),
      ...doc
    })
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, type, location, status, maintenanceSchedule, lastMaintenance } = req.body
    const col = await getCollection('equipment')
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { name, type, location, status, maintenanceSchedule, lastMaintenance } })
    const updated = await col.findOne({ _id: new ObjectId(id) })
    res.json({
      id: updated._id.toString(),
      name: updated.name,
      type: updated.type,
      location: updated.location,
      status: updated.status,
      lastMaintenance: updated.lastMaintenance,
      maintenanceSchedule: updated.maintenanceSchedule
    })
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const col = await getCollection('equipment')
    await col.deleteOne({ _id: new ObjectId(id) })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
