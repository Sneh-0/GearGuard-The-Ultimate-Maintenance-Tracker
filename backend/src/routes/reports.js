import { Router } from 'express'
import { getCollection } from '../db.js'

const router = Router()

router.get('/summary', async (req, res, next) => {
  try {
    const equipmentCol = await getCollection('equipment')
    const reqCol = await getCollection('maintenance_requests')
    const totalEquipment = await equipmentCol.countDocuments()
    const maintenanceRequests = await reqCol.countDocuments()
    const completedRequests = await reqCol.countDocuments({ status: 'Repaired' })
    const overdueEquipment = await equipmentCol.countDocuments({ status: 'Overdue' })
    res.json({ totalEquipment, maintenanceRequests, completedRequests, overdueEquipment })
  } catch (e) { next(e) }
})

export default router
