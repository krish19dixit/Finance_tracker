// MongoDB Seed Script
// Run this script to populate your database with sample data
// Usage: node scripts/seed-database.js

const { MongoClient } = require("mongodb")

const MONGODB_URI =
  "mongodb+srv://rkdrkd2121:ya4S0JdrCbijjO2n@cluster0.rf9ognd.mongodb.net/finance_tracker?retryWrites=true&w=majority&appName=Cluster0"

const sampleTransactions = [
  {
    description: "Monthly Salary",
    amount: 5000,
    date: "2024-01-15",
    type: "income",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Freelance Project Payment",
    amount: 1200,
    date: "2024-01-10",
    type: "income",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Rent Payment",
    amount: 1500,
    date: "2024-01-01",
    type: "expense",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Grocery Shopping",
    amount: 250,
    date: "2024-01-05",
    type: "expense",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Utilities Bill",
    amount: 180,
    date: "2024-01-03",
    type: "expense",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Gas Station",
    amount: 60,
    date: "2024-01-08",
    type: "expense",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Investment Dividend",
    amount: 300,
    date: "2024-01-12",
    type: "income",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Restaurant Dinner",
    amount: 85,
    date: "2024-01-14",
    type: "expense",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Online Course",
    amount: 99,
    date: "2024-01-16",
    type: "expense",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Side Hustle Income",
    amount: 450,
    date: "2024-01-18",
    type: "income",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas")

    const db = client.db("finance_tracker")
    const collection = db.collection("transactions")

    // Clear existing data
    await collection.deleteMany({})
    console.log("Cleared existing transactions")

    // Insert sample data
    const result = await collection.insertMany(sampleTransactions)
    console.log(`Inserted ${result.insertedCount} sample transactions`)

    // Create indexes for better performance
    await collection.createIndex({ date: -1 })
    await collection.createIndex({ type: 1 })
    await collection.createIndex({ createdAt: -1 })
    console.log("Created database indexes")

    // Display summary
    const totalTransactions = await collection.countDocuments()
    const totalIncome = await collection
      .aggregate([{ $match: { type: "income" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
      .toArray()

    const totalExpenses = await collection
      .aggregate([{ $match: { type: "expense" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
      .toArray()

    console.log("\n=== Database Summary ===")
    console.log(`Total Transactions: ${totalTransactions}`)
    console.log(`Total Income: $${totalIncome[0]?.total || 0}`)
    console.log(`Total Expenses: $${totalExpenses[0]?.total || 0}`)
    console.log(`Net Balance: $${(totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0)}`)
    console.log("========================\n")

    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

seedDatabase()
