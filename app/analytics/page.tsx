"use client"

import { ArrowLeft, BarChart3, PieChart, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BalanceChart } from "@/components/balance-chart"
import { IncomeChart } from "@/components/income-chart"
import { ExpenseChart } from "@/components/expense-chart"
import { TransactionChart } from "@/components/transaction-chart"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useSettings } from "@/lib/context/SettingsContext"

export default function AnalyticsPage() {
  const { financialData, loading } = useFinancialData()
  const { currencyCode, getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol(currencyCode)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const incomeTransactions = financialData.transactions.filter((t) => t.type === "income")
  const expenseTransactions = financialData.transactions.filter((t) => t.type === "expense")
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                <p className="text-gray-600 mt-1">Deep insights into your financial patterns</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Financial Health Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.min(
                      100,
                      Math.max(
                        0,
                        Math.round((financialData.totalBalance / Math.max(financialData.monthlyExpenses, 1)) * 20),
                      ),
                    )}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Savings Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {financialData.monthlyIncome > 0
                      ? Math.round(
                        ((financialData.monthlyIncome - financialData.monthlyExpenses) /
                          financialData.monthlyIncome) *
                        100,
                      )
                      : 0}
                    %
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expense Ratio</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {financialData.monthlyIncome > 0
                      ? Math.round((financialData.monthlyExpenses / financialData.monthlyIncome) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transaction Volume</p>
                  <p className="text-2xl font-bold text-purple-600">{financialData.transactions.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Complete picture of your finances</CardDescription>
                </CardHeader>
                <CardContent>
                  <BalanceChart
                    balance={financialData.totalBalance}
                    income={financialData.monthlyIncome}
                    expenses={financialData.monthlyExpenses}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Important financial metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm font-medium">Monthly Net Income</span>
                      <span className="font-bold text-green-600">
                        {currency}{(financialData.monthlyIncome - financialData.monthlyExpenses).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Average Transaction</span>
                      <span className="font-bold text-blue-600">
                        {currency}
                        {financialData.transactions.length > 0
                          ? Math.round(
                            financialData.transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / financialData.transactions.length,
                          ).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span className="text-sm font-medium">Emergency Fund Ratio</span>
                      <span className="font-bold text-purple-600">
                        {financialData.monthlyExpenses > 0
                          ? Math.round((financialData.totalBalance / financialData.monthlyExpenses) * 10) / 10
                          : 0}{" "}
                        months
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <CardTitle>Balance Analysis</CardTitle>
                <CardDescription>Detailed balance breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <BalanceChart
                  balance={financialData.totalBalance}
                  income={financialData.monthlyIncome}
                  expenses={financialData.monthlyExpenses}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Analysis</CardTitle>
                <CardDescription>Income trends and performance metrics</CardDescription>
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
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>Spending patterns and budget performance</CardDescription>
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
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Analysis</CardTitle>
                <CardDescription>Transaction patterns and flow analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionChart
                  transactions={financialData.transactions.map(transaction => ({
                    ...transaction,
                    createdAt: transaction.createdAt || new Date().toISOString()
                  }))}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Financial Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Financial Recommendations</CardTitle>
            <CardDescription>Personalized advice based on your financial data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {financialData.totalBalance < financialData.monthlyExpenses && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Build Emergency Fund</h4>
                  <p className="text-sm text-red-600">
                    Your balance is below one month of expenses. Consider building an emergency fund.
                  </p>
                </div>
              )}

              {financialData.monthlyExpenses / financialData.monthlyIncome > 0.8 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">High Expense Ratio</h4>
                  <p className="text-sm text-orange-600">
                    You're spending over 80% of your income. Consider reducing expenses.
                  </p>
                </div>
              )}

              {financialData.monthlyIncome - financialData.monthlyExpenses > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Great Savings Rate!</h4>
                  <p className="text-sm text-green-600">
                    You're saving money each month. Consider investing your surplus.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
