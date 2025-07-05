import mongoose from "mongoose"

export interface ITransaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: "Date must be in YYYY-MM-DD format",
      },
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
TransactionSchema.index({ date: -1 })
TransactionSchema.index({ type: 1 })
TransactionSchema.index({ createdAt: -1 })

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
