"use client"

import { ArrowLeft, Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { TransactionCard } from "@/components/transaction-card"
import { TransactionChart } from "@/components/transaction-chart"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useSettings } from "@/lib/context/SettingsContext"
import { useState } from "react"

export default function TransactionsPage() {
  const { financialData, loading, addTransaction, updateTransaction, deleteTransaction } = useFinancialData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const { currencyCode, getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol(currencyCode)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const filteredTransactions = financialData.transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || transaction.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleQuickAdd = () => {
    const description = prompt("Transaction description:")
    const amount = prompt("Amount:")
    const type = confirm("Is this income? (Cancel for expense)") ? "income" : "expense"
    if (description && amount) {
      addTransaction({
        description,
        amount: Number.parseFloat(amount),
        date: new Date().toISOString().split("T")[0],
        type,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
                <p className="text-gray-600 mt-1">Manage all your financial transactions</p>
              </div>
            </div>
            <Button onClick={handleQuickAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>Find specific transactions quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={(value: "all" | "income" | "expense") => setFilterType(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredTransactions.filter((t) => t.type === "income").length}
                </p>
                <p className="text-sm text-gray-600">Income Transactions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {filteredTransactions.filter((t) => t.type === "expense").length}
                </p>
                <p className="text-sm text-gray-600">Expense Transactions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {currency}
                  {filteredTransactions
                    .reduce((sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount), 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Net Amount</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction List</CardTitle>
              <CardDescription>
                {filteredTransactions.length} of {financialData.transactions.length} transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction._id}
                      transaction={{
                        ...transaction,
                        createdAt: transaction.createdAt || new Date().toISOString()
                      }}
                      onUpdate={updateTransaction}
                      onDelete={deleteTransaction}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No transactions found</p>
                    <Button onClick={handleQuickAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>Visual representation of your transaction data</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionChart transactions={filteredTransactions.map(transaction => ({
                ...transaction,
                createdAt: transaction.createdAt || new Date().toISOString()
              }))} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
