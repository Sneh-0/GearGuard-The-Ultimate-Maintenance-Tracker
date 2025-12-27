import { Router } from 'express'
import { getCollection, ObjectId } from '../db.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const col = await getCollection('maintenance_requests')
    const docs = await col.find({}).sort({ _id: -1 }).toArray()
    res.json(docs.map(d => ({
      id: d._id.toString(),
      equipmentId: d.equipmentId,
      equipmentName: d.equipmentName,
      requestType: d.requestType,
      status: d.status,
      priority: d.priority,
      description: d.description,
      requestedBy: d.requestedBy,
      assignedToEmail: d.assignedToEmail,
      assignedTeamId: d.assignedTeamId,
      assignedTeamName: d.assignedTeamName,
      createdDate: d.createdDate,
      dueDate: d.dueDate,
      scheduledDate: d.scheduledDate
    })))
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const { equipmentId, equipmentName, requestType, status, priority, description, requestedBy, assignedToEmail, assignedTeamId, assignedTeamName, dueDate, scheduledDate } = req.body
    const roleHeader = (req.headers['x-user-role'] || '').toString().toLowerCase()
    const today = new Date(); today.setHours(0,0,0,0)
    const parseDate = (d) => (d ? new Date(d) : null)
    const sched = parseDate(scheduledDate)
    const due = parseDate(dueDate)
    if (sched && sched < today) return res.status(400).json({ error: 'scheduledDate cannot be in the past' })
    if (due && due < today) return res.status(400).json({ error: 'dueDate cannot be in the past' })
    if (roleHeader === 'technician') {
      if (assignedTeamId || assignedTeamName || assignedToEmail) {
        return res.status(403).json({ error: 'Technicians cannot assign teams or technicians to requests' })
      }
      if (scheduledDate) {
        return res.status(403).json({ error: 'Technicians cannot create scheduled requests via calendar' })
      }
    }
    if (assignedToEmail) {
      const usersCol = await getCollection('users')
      const user = await usersCol.findOne({ email: assignedToEmail, role: 'Technician' })
      if (!user) return res.status(400).json({ error: 'assignedToEmail must be a valid Technician email' })
    }
    const col = await getCollection('maintenance_requests')
    const doc = {
      equipmentId,
      equipmentName,
      requestType,
      status: status || 'New',
      priority: priority || 'Medium',
      description,
      requestedBy,
      assignedToEmail,
      assignedTeamId,
      assignedTeamName,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate,
      scheduledDate
    }
    const result = await col.insertOne(doc)
    res.status(201).json({ id: result.insertedId.toString(), ...doc })
  } catch (e) { next(e) }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const allowed = ['requestType', 'status', 'priority', 'description', 'assignedToEmail', 'assignedTeamId', 'assignedTeamName', 'dueDate', 'scheduledDate']
    const set = {}
    for (const f of allowed) {
      if (req.body[f] !== undefined) set[f] = req.body[f]
    }
    const roleHeader = (req.headers['x-user-role'] || '').toString().toLowerCase()
    const today = new Date(); today.setHours(0,0,0,0)
    const parseDate = (d) => (d ? new Date(d) : null)
    const sched = parseDate(set.scheduledDate)
    const due = parseDate(set.dueDate)
    if (sched && sched < today) return res.status(400).json({ error: 'scheduledDate cannot be in the past' })
    if (due && due < today) return res.status(400).json({ error: 'dueDate cannot be in the past' })
    if (roleHeader === 'technician') {
      if (set.assignedTeamId !== undefined || set.assignedTeamName !== undefined || set.assignedToEmail !== undefined) {
        return res.status(403).json({ error: 'Technicians cannot assign teams or technicians to requests' })
      }
    }
    if (set.assignedToEmail) {
      const usersCol = await getCollection('users')
      const user = await usersCol.findOne({ email: set.assignedToEmail, role: 'Technician' })
      if (!user) return res.status(400).json({ error: 'assignedToEmail must be a valid Technician email' })
    }
    const col = await getCollection('maintenance_requests')
    await col.updateOne({ _id: new ObjectId(id) }, { $set: set })
    const updated = await col.findOne({ _id: new ObjectId(id) })
    res.json({
      id: updated._id.toString(),
      equipmentId: updated.equipmentId,
      equipmentName: updated.equipmentName,
      requestType: updated.requestType,
      status: updated.status,
      priority: updated.priority,
      description: updated.description,
      requestedBy: updated.requestedBy,
      assignedToEmail: updated.assignedToEmail,
      assignedTeamId: updated.assignedTeamId,
      assignedTeamName: updated.assignedTeamName,
      createdDate: updated.createdDate,
      dueDate: updated.dueDate,
      scheduledDate: updated.scheduledDate
    })
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const roleHeader = (req.headers['x-user-role'] || '').toString().toLowerCase()
    const col = await getCollection('maintenance_requests')
    const doc = await col.findOne({ _id: new ObjectId(id) })
    if (roleHeader === 'technician' && doc && doc.scheduledDate) {
      return res.status(403).json({ error: 'Technicians cannot remove scheduled requests via calendar' })
    }
    await col.deleteOne({ _id: new ObjectId(id) })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
