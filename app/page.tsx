"use client"
import { DollarSign, TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, LineChart, History, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EditableMetricCard } from "@/components/editable-metric-card"
import { QuickTransactionForm } from "@/components/quick-transaction-form"
import { RecentTransactions } from "@/components/recent-transactions"
import { useFinancialData } from "@/hooks/use-financial-data"
import { useSettings } from "@/lib/context/SettingsContext"

export default function DashboardPage() {
  const { currencyCode, setCurrencyCode } = useSettings();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };
  const { financialData, loading, addTransaction, updateTransaction, deleteTransaction } =
    useFinancialData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    )
  }

  const netIncome = financialData.monthlyIncome - financialData.monthlyExpenses

  const filteredTransactions = financialData.transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes("".toLowerCase())
    const matchesFilter = true
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your financial health</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/transactions">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View All Transactions
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline">
                  <PieChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {currencyCode}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setCurrencyCode("INR")}>INR</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrencyCode("USD")}>USD</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrencyCode("EUR")}>EUR</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrencyCode("JPY")}>JPY</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setCurrencyCode("GBP")}>GBP</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/balance" className="group">
            <Card className="hover:shadow-lg transition-all cursor-pointer group-hover:border-blue-300">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Balance</p>
                <p className="text-sm text-gray-500">View & Edit</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/income" className="group">
            <Card className="hover:shadow-lg transition-all cursor-pointer group-hover:border-green-300">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Income</p>
                <p className="text-sm text-gray-500">Track & Analyze</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/expenses" className="group">
            <Card className="hover:shadow-lg transition-all cursor-pointer group-hover:border-red-300">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="font-medium">Expenses</p>
                <p className="text-sm text-gray-500">Monitor & Control</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics" className="group">
            <Card className="hover:shadow-lg transition-all cursor-pointer group-hover:border-purple-300">
              <CardContent className="p-4 text-center">
                <LineChart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-gray-500">Insights & Trends</p>
              </CardContent>
            </Card>
          </Link>
        </div>



        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Add Transaction */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Add Transaction</CardTitle>
              <CardDescription>Add a new income or expense quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <QuickTransactionForm onSubmit={addTransaction} />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </div>
              <Link href="/transactions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentTransactions
                transactions={financialData.transactions
                  .slice(0, 5)
                  .map(transaction => ({
                    ...transaction,
                    createdAt: transaction.createdAt || new Date().toISOString()
                  }))}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{financialData.transactions.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month's Transactions</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      financialData.transactions
                        .reduce((sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount), 0)
                    )}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Savings Rate</p>
                  <p className="text-2xl font-bold">
                    {financialData.monthlyIncome > 0 ? Math.round((netIncome / financialData.monthlyIncome) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
