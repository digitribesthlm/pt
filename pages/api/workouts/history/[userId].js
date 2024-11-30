import { connectToDatabase } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { userId } = req.query
    const { db } = await connectToDatabase()

    // Get both completed workouts and workout programs
    const [completedWorkouts, workoutPrograms] = await Promise.all([
      db.collection('completed_workouts')
        .find({ userId })
        .sort({ completed: -1 })
        .toArray(),
      db.collection('workout_programs')
        .find({ userId })
        .sort({ created: -1 })
        .toArray()
    ])

    // Combine and sort by date
    const allWorkouts = [
      ...workoutPrograms.map(w => ({ ...w, type: 'program' })),
      ...completedWorkouts.map(w => ({ ...w, type: 'completed' }))
    ].sort((a, b) => {
      const dateA = new Date(a.completed || a.created)
      const dateB = new Date(b.completed || b.created)
      return dateB - dateA
    })

    res.status(200).json(allWorkouts)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    res.status(500).json({ message: 'Failed to fetch workouts' })
  }
}
