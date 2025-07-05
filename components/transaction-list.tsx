"use client"

import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSettings } from "@/lib/context/SettingsContext"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const { currency } = useSettings()
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No transactions yet</p>
        <p className="text-sm text-gray-400">Add your first transaction to get started</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-full ${
                  transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpCircle className="h-4 w-4" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : "-"}{currency}{transaction.amount.toLocaleString()}
                </p>
                <Badge variant={transaction.type === "income" ? "default" : "secondary"} className="text-xs">
                  {transaction.type}
                </Badge>
              </div>

              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" onClick={() => onEdit(transaction)} className="h-8 w-8 p-0">
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(transaction._id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
