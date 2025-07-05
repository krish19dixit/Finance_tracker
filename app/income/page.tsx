"use client"

import { ArrowLeft, TrendingUp, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditableMetricCard } from "@/components/editable-metric-card"
import { IncomeChart } from "@/components/income-chart"
import { TransactionCard } from "@/components/transaction-card"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useSettings } from "@/lib/context/SettingsContext"

export default function IncomePage() {
  const { financialData, loading, updateMetric, addTransaction, updateTransaction, deleteTransaction } =
    useFinancialData()
  const { currencyCode, getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol(currencyCode)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const incomeTransactions = financialData.transactions.filter((t) => t.type === "income")
  const totalActualIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
                <p className="text-gray-600 mt-1">Track and analyze your income sources</p>
              </div>
            </div>
            <Button
              onClick={() => {
                const description = prompt("Income source:")
                const amount = prompt("Amount:")
                if (description && amount) {
                  addTransaction({
                    description,
                    amount: Number.parseFloat(amount),
                    date: new Date().toISOString().split("T")[0],
                    type: "income",
                  })
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Income Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EditableMetricCard
            title="Monthly Income Target"
            value={financialData.monthlyIncome}
            icon={<TrendingUp className="h-4 w-4" />}
            color="green"
            onSave={(value) => updateMetric("monthlyIncome", value)}
            description="Your target monthly income"
            large
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Actual Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{currency}{totalActualIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">From {incomeTransactions.length} income sources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Income Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${totalActualIncome >= financialData.monthlyIncome ? "text-green-600" : "text-orange-600"
                  }`}
              >
                {financialData.monthlyIncome > 0
                  ? Math.round((totalActualIncome / financialData.monthlyIncome) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-2">Of monthly target</p>
            </CardContent>
          </Card>
        </div>

        {/* Income Visualization and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Income Analysis</CardTitle>
              <CardDescription>Visualize your income trends and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeChart
                monthlyIncome={financialData.monthlyIncome}
                transactions={incomeTransactions.map(transaction => ({
                  ...transaction,
                  createdAt: transaction.createdAt || new Date().toISOString()
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>All your income transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {incomeTransactions.length > 0 ? (
                  incomeTransactions.map((transaction) => (
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
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No income transactions yet</p>
                    <Button
                      onClick={() => {
                        const description = prompt("Income source:")
                        const amount = prompt("Amount:")
                        if (description && amount) {
                          addTransaction({
                            description,
                            amount: Number.parseFloat(amount),
                            date: new Date().toISOString().split("T")[0],
                            type: "income",
                          })
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Income
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Income Insights</CardTitle>
            <CardDescription>Key metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Average Income</h4>
                <p className="text-2xl font-bold text-green-600">
                  {currency}
                  {incomeTransactions.length > 0
                    ? Math.round(totalActualIncome / incomeTransactions.length).toLocaleString()
                    : "0"}
                </p>
                <p className="text-sm text-green-600">Per transaction</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Highest Income</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {currency}
                  {incomeTransactions.length > 0
                    ? Math.max(...incomeTransactions.map((t) => t.amount)).toLocaleString()
                    : "0"}
                </p>
                <p className="text-sm text-blue-600">Single transaction</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Income Frequency</h4>
                <p className="text-2xl font-bold text-purple-600">{incomeTransactions.length}</p>
                <p className="text-sm text-purple-600">Transactions this period</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800">Target Gap</h4>
                <p
                  className={`text-2xl font-bold ${(financialData.monthlyIncome - totalActualIncome) <= 0 ? "text-green-600" : "text-orange-600"
                    }`}
                >
                  {currency}{Math.abs(financialData.monthlyIncome - totalActualIncome).toLocaleString()}
                </p>
                <p className="text-sm text-orange-600">
                  {financialData.monthlyIncome - totalActualIncome <= 0 ? "Exceeded target!" : "Below target"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
