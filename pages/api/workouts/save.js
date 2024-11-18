import { connectToDatabase } from '../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { db } = await connectToDatabase()
    const workout = req.body

    console.log('Attempting to save workout:', workout)

    const now = new Date()
    const workoutData = {
      name: workout.name,
      userId: workout.userId,
      date: now.toISOString().split('T')[0],
      daysAgo: 0,
      type: "Egen träning",
      exercises: workout.exercises.map(exercise => ({
        id: parseInt(Math.random() * 1000),
        name: exercise.name,
        measureType: exercise.measureType,
        value: exercise.value,
        completed: true
      })),
      duration: workout.duration,
      completed: true,
      created: now,
      updated: now
    }

    console.log('Formatted workout data:', workoutData)

    const result = await db.collection('saved_workouts').insertOne(workoutData)

    console.log('Workout saved successfully:', result)

    res.status(200).json({ message: 'Workout saved successfully', id: result.insertedId })
  } catch (error) {
    console.error('Error saving workout:', {
      message: error.message,
      stack: error.stack,
      workout: req.body
    })
    res.status(500).json({ error: 'Failed to save workout' })
  }
} 