"use client"

import { TransactionCard } from "@/components/transaction-card"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  onUpdate: (id: string, updatedTransaction: Omit<Transaction, "_id" | "createdAt">) => void
  onDelete: (id: string) => void
}

export function RecentTransactions({ transactions, onUpdate, onDelete }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No transactions yet</p>
        <p className="text-sm text-gray-400">Add your first transaction to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction._id} transaction={transaction} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}
