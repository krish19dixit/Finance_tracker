"use client"

import { ArrowLeft, DollarSign, Edit3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditableMetricCard } from "@/components/editable-metric-card"
import { BalanceChart } from "@/components/balance-chart"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useSettings } from "@/lib/context/SettingsContext"

export default function BalancePage() {
  const { financialData, loading, updateMetric } = useFinancialData()
  const { currencyCode } = useSettings()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
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
                <h1 className="text-2xl font-bold text-gray-900">Balance Management</h1>
                <p className="text-gray-600 mt-1">View and edit your current financial balance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EditableMetricCard
            title="Current Balance"
            value={financialData.totalBalance}
            icon={<DollarSign className="h-4 w-4" />}
            color="blue"
            onSave={(value) => updateMetric("totalBalance", value)}
            description="Your total available balance"
            large
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Balance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {financialData.totalBalance >= 0 ? "Positive" : "Negative"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {financialData.totalBalance >= 0 ? "Your balance is healthy" : "Consider reducing expenses"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Monthly Net</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  (financialData.monthlyIncome - financialData.monthlyExpenses) >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency((financialData.monthlyIncome - financialData.monthlyExpenses))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Income minus expenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Balance Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Balance Breakdown</CardTitle>
              <CardDescription>Visual representation of your financial position</CardDescription>
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
              <CardTitle>Balance History</CardTitle>
              <CardDescription>Track your balance changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Current Balance</span>
                  <span className="font-semibold">{formatCurrency(financialData.totalBalance)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Monthly Income</span>
                  <span className="font-semibold text-green-600">+{formatCurrency(financialData.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Monthly Expenses</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(financialData.monthlyExpenses)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Projected Next Month</span>
                    <span
                      className={`font-bold ${
                        (financialData.totalBalance + financialData.monthlyIncome - financialData.monthlyExpenses) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(
                        financialData.totalBalance +
                        financialData.monthlyIncome -
                        financialData.monthlyExpenses
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common balance-related actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-16 flex flex-col items-center justify-center space-y-2">
                <Edit3 className="h-5 w-5" />
                <span>Edit Balance</span>
              </Button>
              <Link href="/transactions">
                <Button
                  variant="outline"
                  className="h-16 w-full flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Add Transaction</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="outline"
                  className="h-16 w-full flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>View Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
