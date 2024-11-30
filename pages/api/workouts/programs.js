import { connectToDatabase } from '../../../utils/mongodb'

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()

    // GET: Fetch user's workout programs
    if (req.method === 'GET') {
      const { userId } = req.query
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' })
      }

      const programs = await db.collection('workout_programs')
        .find({ userId })
        .sort({ created: -1 })
        .toArray()

      return res.status(200).json(programs)
    }

    // POST: Save new workout program
    if (req.method === 'POST') {
      const { userId, name, exercises } = req.body
      
      if (!userId || !name || !exercises) {
        return res.status(400).json({ message: 'userId, name, and exercises are required' })
      }

      const program = {
        userId,
        name,
        exercises,
        created: new Date(),
        updated: new Date()
      }

      const result = await db.collection('workout_programs').insertOne(program)
      return res.status(201).json({ ...program, _id: result.insertedId })
    }
  } catch (error) {
    console.error('Error handling workout programs:', error)
    res.status(500).json({ message: 'Error handling workout programs', error: error.message })
  }
}
