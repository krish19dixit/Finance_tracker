"use client"

import { useState } from "react"
import { Edit3, Trash2, Save, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/lib/context/SettingsContext"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt: string
}

interface TransactionCardProps {
  transaction: Transaction
  onUpdate: (id: string, updatedTransaction: Omit<Transaction, "_id" | "createdAt">) => void
  onDelete: (id: string) => void
}

export function TransactionCard({ transaction, onUpdate, onDelete }: TransactionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    description: transaction.description,
    amount: transaction.amount.toString(),
    date: transaction.date,
    type: transaction.type,
  })
  const { currencyCode } = useSettings()

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
    return formattedAmount;
  };

  const handleSave = () => {
    const amount = Number.parseFloat(editData.amount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    onUpdate(transaction._id, {
      description: editData.description,
      amount,
      date: editData.date,
      type: editData.type as "income" | "expense",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date,
      type: transaction.type,
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
        <div className="space-y-3">
          <Input
            value={editData.description}
            onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
          />

          <div className="flex space-x-2">
            <Input
              type="number"
              value={editData.amount}
              onChange={(e) => setEditData((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder={formatCurrency(0)} // Placeholder with currency format
              className="flex-1"
            />

            <Select
              value={editData.type}
              onValueChange={(value: "income" | "expense") => setEditData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData((prev) => ({ ...prev, date: e.target.value }))}
          />

          <div className="flex justify-end space-x-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
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
            {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
          <Badge variant={transaction.type === "income" ? "default" : "secondary"} className="text-xs">
            {transaction.type}
          </Badge>
        </div>

        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm("Are you sure you want to delete this transaction?")) {
                onDelete(transaction._id)
              }
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
