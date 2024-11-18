import { connectToDatabase } from '../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  try {
    const token = req.cookies['auth-token']
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    // Decode base64 token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    })

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const userData = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      clientId: user.clientId
    }

    res.status(200).json({ user: userData })
  } catch (error) {
    console.error('Auth check error:', error)
    res.status(401).json({ message: 'Authentication failed' })
  }
} 