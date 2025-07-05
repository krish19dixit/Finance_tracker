"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSettings } from "@/lib/context/SettingsContext"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt: string
}

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Transaction, "_id" | "createdAt">) => void
  initialData?: Transaction | null
  mode: "add" | "edit"
}

export function TransactionForm({ isOpen, onClose, onSubmit, initialData, mode }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    type: "expense" as "income" | "expense",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description,
        amount: initialData.amount.toString(),
        date: initialData.date,
        type: initialData.type,
      })
    } else {
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      description: formData.description.trim(),
      amount: Number(formData.amount),
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === "edit" ? "Update" : "Add"} Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
