import { connectToDatabase } from '../../../utils/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const workout = req.body

    // Add creation timestamp
    workout.completed = new Date()
    
    const result = await db.collection('completed_workouts').insertOne(workout)
    
    res.status(201).json({ 
      message: 'Workout completed successfully',
      workoutId: result.insertedId 
    })
  } catch (error) {
    console.error('Error saving completed workout:', error)
    res.status(500).json({ message: 'Failed to save completed workout' })
  }
}
