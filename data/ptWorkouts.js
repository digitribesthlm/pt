export const ptWorkouts = [
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Styrkepass 1",
    ptId: "507f1f77bcf86cd799439001",
    ptName: "Jessica Nyström",
    clientId: "507f1f77bcf86cd799439002",
    clientName: "Jesper Andersson",
    status: "active",
    type: "strength",
    date: "2023-09-01",
    description: "Fokus på överkropp och explosivitet",
    exercises: [
      {
        id: 11,
        name: "Bänkpress",
        sets: [
          { reps: 12, weight: 60 },
          { reps: 10, weight: 65 },
          { reps: 8, weight: 70 }
        ]
      },
      {
        id: 13,
        name: "Frivänd",
        sets: [
          { reps: 5, weight: 40 },
          { reps: 5, weight: 45 },
          { reps: 5, weight: 45 }
        ]
      },
      {
        id: 17,
        name: "Hängfrivändning",
        sets: [
          { reps: 6, weight: 35 },
          { reps: 6, weight: 35 },
          { reps: 6, weight: 35 }
        ]
      }
    ],
    created: new Date("2023-09-01").toISOString(),
    updated: new Date("2023-09-01").toISOString()
  }
]
