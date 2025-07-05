"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings } from "@/lib/context/SettingsContext"

interface Transaction {
  description: string
  amount: number
  date: string
  type: "income" | "expense"
}

interface QuickTransactionFormProps {
  onSubmit: (transaction: Transaction) => void
}

export function QuickTransactionForm({ onSubmit }: QuickTransactionFormProps) {
  const { currencyCode, getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol(currencyCode)

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "income" | "expense",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description.trim() || !formData.amount) {
      alert("Please fill in all fields")
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    onSubmit({
      description: formData.description.trim(),
      amount,
      date: formData.date,
      type: formData.type,
    })

    // Reset form
    setFormData({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount ({currency})</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "income" | "expense") => setFormData((prev) => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
    </form>
  )
}
