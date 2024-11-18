import { connectToDatabase } from '../../../../src/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  try {
    const { userId } = req.query
    const { db } = await connectToDatabase()
    
    // First get the user to access their scheduled workouts
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(userId)
    })

    if (!user || !user.workouts || !user.workouts.scheduled) {
      return res.status(200).json([])
    }

    // Convert scheduled workout IDs to ObjectIds
    const scheduledWorkoutIds = user.workouts.scheduled.map(id => new ObjectId(id))
    
    // Fetch the scheduled PT workouts
    const ptWorkouts = await db.collection('pt_workouts')
      .find({ _id: { $in: scheduledWorkoutIds } })
      .toArray()

    console.log('Fetched PT workouts:', ptWorkouts)
    
    res.status(200).json(ptWorkouts)
  } catch (error) {
    console.error('Error fetching PT workouts:', error)
    res.status(500).json({ error: 'Failed to fetch PT workouts' })
  }
}
