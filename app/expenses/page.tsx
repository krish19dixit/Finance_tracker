"use client"

import { ArrowLeft, TrendingDown, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditableMetricCard } from "@/components/editable-metric-card"
import { ExpenseChart } from "@/components/expense-chart"
import { TransactionCard } from "@/components/transaction-card"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useSettings } from "@/lib/context/SettingsContext"

export default function ExpensesPage() {
  const { financialData, loading, updateMetric, addTransaction, updateTransaction, deleteTransaction } =
    useFinancialData()
  const { currencyCode, getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol(currencyCode)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const expenseTransactions = financialData.transactions.filter((t) => t.type === "expense")
  const totalActualExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
                <p className="text-gray-600 mt-1">Monitor and control your spending</p>
              </div>
            </div>
            <Button
              onClick={() => {
                const description = prompt("Expense description:")
                const amount = prompt("Amount:")
                if (description && amount) {
                  addTransaction({
                    description,
                    amount: Number.parseFloat(amount),
                    date: new Date().toISOString().split("T")[0],
                    type: "expense",
                  })
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Expense Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EditableMetricCard
            title="Monthly Budget"
            value={financialData.monthlyExpenses}
            icon={<TrendingDown className="h-4 w-4" />}
            color="red"
            onSave={(value) => updateMetric("monthlyExpenses", value)}
            description="Your monthly expense budget"
            large
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Actual Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{currency}{totalActualExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">From {expenseTransactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${totalActualExpenses <= financialData.monthlyExpenses ? "text-green-600" : "text-red-600"
                  }`}
              >
                {financialData.monthlyExpenses > 0
                  ? Math.round((totalActualExpenses / financialData.monthlyExpenses) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-2">Of monthly budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Expense Visualization and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>Visualize your spending patterns and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart
                monthlyExpenses={financialData.monthlyExpenses}
                transactions={expenseTransactions.map(transaction => ({
                  ...transaction,
                  createdAt: transaction.createdAt || new Date().toISOString()
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>All your expense transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenseTransactions.length > 0 ? (
                  expenseTransactions.map((transaction) => (
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
                    <TrendingDown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No expense transactions yet</p>
                    <Button
                      onClick={() => {
                        const description = prompt("Expense description:")
                        const amount = prompt("Amount:")
                        if (description && amount) {
                          addTransaction({
                            description,
                            amount: Number.parseFloat(amount),
                            date: new Date().toISOString().split("T")[0],
                            type: "expense",
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Expense
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Expense Insights</CardTitle>
            <CardDescription>Spending analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800">Average Expense</h4>
                <p className="text-2xl font-bold text-red-600">
                  {currency}
                  {expenseTransactions.length > 0
                    ? Math.round(totalActualExpenses / expenseTransactions.length).toLocaleString()
                    : "0"}
                </p>
                <p className="text-sm text-red-600">Per transaction</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800">Largest Expense</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {currency}
                  {expenseTransactions.length > 0
                    ? Math.max(...expenseTransactions.map((t) => t.amount)).toLocaleString()
                    : "0"}
                </p>
                <p className="text-sm text-orange-600">Single transaction</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Expense Frequency</h4>
                <p className="text-2xl font-bold text-purple-600">{expenseTransactions.length}</p>
                <p className="text-sm text-purple-600">Transactions this period</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Budget Remaining</h4>
                <p
                  className={`text-2xl font-bold ${(financialData.monthlyExpenses - totalActualExpenses) >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {currency}{Math.abs(financialData.monthlyExpenses - totalActualExpenses).toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">
                  {financialData.monthlyExpenses - totalActualExpenses >= 0 ? "Under budget" : "Over budget"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
