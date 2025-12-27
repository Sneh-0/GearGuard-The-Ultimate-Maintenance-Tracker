import { Router } from 'express'
import { getCollection, ObjectId } from '../db.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const col = await getCollection('teams')
    const docs = await col.find({}).sort({ _id: 1 }).toArray()
    const usersCol = await getCollection('users')
    const results = []
    for (const d of docs) {
      const emails = Array.isArray(d.members) ? d.members : []
      const users = emails.length > 0 ? await usersCol.find({ email: { $in: emails } }).toArray() : []
      const userMap = new Map(users.map(u => [u.email, u]))
      results.push({
        id: d._id.toString(),
        name: d.name,
        lead: d.lead,
        members: emails.map(e => ({ email: e, name: userMap.get(e)?.name || null })),
        assignedEquipment: Array.isArray(d.assignedEquipment) ? d.assignedEquipment : []
      })
    }
    res.json(results)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, lead, members } = req.body
    if (!name || !lead) return res.status(400).json({ error: 'name and lead are required' })
    const memberEmails = Array.isArray(members) ? members : []
    const usersCol = await getCollection('users')
    const users = await usersCol.find({ email: { $in: memberEmails }, role: 'Technician' }).toArray()
    const validEmails = new Set(users.map(u => u.email))
    const invalid = memberEmails.filter(e => !validEmails.has(e))
    if (invalid.length > 0) {
      return res.status(400).json({ error: 'Invalid technician emails', invalid })
    }
    const col = await getCollection('teams')
    const doc = { name, lead, members: memberEmails }
    const result = await col.insertOne(doc)
    res.status(201).json({ id: result.insertedId.toString(), ...doc })
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, lead, members } = req.body
    const memberEmails = Array.isArray(members) ? members : []
    const usersCol = await getCollection('users')
    const users = await usersCol.find({ email: { $in: memberEmails }, role: 'Technician' }).toArray()
    const validEmails = new Set(users.map(u => u.email))
    const invalid = memberEmails.filter(e => !validEmails.has(e))
    if (invalid.length > 0) {
      return res.status(400).json({ error: 'Invalid technician emails', invalid })
    }
    const col = await getCollection('teams')
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { name, lead, members: memberEmails } })
    const updated = await col.findOne({ _id: new ObjectId(id) })
    res.json({ id: updated._id.toString(), name: updated.name, lead: updated.lead, members: updated.members || [] })
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const col = await getCollection('teams')
    await col.deleteOne({ _id: new ObjectId(id) })
    res.status(204).end()
  } catch (e) { next(e) }
})

export default router
