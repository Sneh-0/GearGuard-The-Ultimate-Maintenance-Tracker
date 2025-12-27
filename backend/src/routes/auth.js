import { Router } from 'express'
import crypto from 'crypto'
import { getCollection } from '../db.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const col = await getCollection('users')
    const user = await col.findOne({ email, password })
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }
    res.json({ success: true, user: { email: user.email, name: user.name, role: user.role } })
  } catch (e) { next(e) }
})

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }
    const allowedRoles = ['Admin', 'Manager', 'Technician']
    const finalRole = allowedRoles.includes(role) ? role : 'Technician'
    // Check if user exists
    const col = await getCollection('users')
    const existing = await col.findOne({ email })
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' })
    }
    await col.insertOne({ email, password, name, role: finalRole })
    res.status(201).json({ success: true, user: { email, name, role: finalRole } })
  } catch (e) { next(e) }
})

export default router

// Password reset endpoints
router.post('/forgot', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' })
    const col = await getCollection('users')
    const user = await col.findOne({ email })
    if (!user) {
      // To avoid user enumeration, respond success
      return res.json({ success: true, message: 'If the email exists, a reset link was created.' })
    }
    const token = crypto.randomBytes(20).toString('hex')
    const expires = Date.now() + 60 * 60 * 1000 // 1 hour
    await col.updateOne({ email }, { $set: { resetToken: token, resetExpires: expires } })
    // In a real app, send email with token; here we return token for demo
    res.json({ success: true, message: 'Reset token generated', token })
  } catch (e) { next(e) }
})

router.post('/reset', async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ success: false, error: 'Token and new password are required' })
    const col = await getCollection('users')
    const user = await col.findOne({ resetToken: token })
    if (!user || !user.resetExpires || user.resetExpires < Date.now()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' })
    }
    await col.updateOne({ email: user.email }, { $set: { password }, $unset: { resetToken: '', resetExpires: '' } })
    res.json({ success: true })
  } catch (e) { next(e) }
})
