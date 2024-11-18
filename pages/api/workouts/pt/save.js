import { connectToDatabase } from '../../../../src/lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const workout = req.body

    console.log('Attempting to save PT workout:', workout)

    const now = new Date()
    const workoutData = {
      name: workout.name,
      ptId: workout.ptId,
      ptName: workout.ptName,
      clientId: workout.clientId,
      clientName: workout.clientName,
      status: workout.status || 'active',
      type: workout.type,
      date: workout.date || now.toISOString().split('T')[0],
      description: workout.description,
      exercises: workout.exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight
        }))
      })),
      created: now,
      updated: now
    }

    console.log('Formatted PT workout data:', workoutData)

    const result = await db.collection('pt_workouts').insertOne(workoutData)

    console.log('PT workout saved successfully:', result)

    res.status(200).json({ message: 'PT workout saved successfully', id: result.insertedId })
  } catch (error) {
    console.error('Error saving PT workout:', {
      message: error.message,
      stack: error.stack,
      workout: req.body
    })
    res.status(500).json({ error: 'Failed to save PT workout' })
  }
}
