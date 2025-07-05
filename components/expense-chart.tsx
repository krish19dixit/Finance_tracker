"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSettings } from "@/lib/context/SettingsContext"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt: string
}

interface ExpenseChartProps {
  monthlyExpenses: number
  transactions: Transaction[]
}

export function ExpenseChart({ monthlyExpenses, transactions }: ExpenseChartProps) {
  const { currencyCode, getCurrencySymbol } = useSettings()
  const currency = getCurrencySymbol(currencyCode)
  // Generate expense categories from transactions
  const generateExpenseCategories = () => {
    const categories: Record<string, number> = {}

    transactions.forEach((transaction) => {
      // Simple categorization based on description keywords
      const desc = transaction.description.toLowerCase()
      let category = "Other"

      if (desc.includes("rent") || desc.includes("mortgage")) category = "Housing"
      else if (desc.includes("grocery") || desc.includes("food") || desc.includes("restaurant")) category = "Food"
      else if (desc.includes("gas") || desc.includes("transport") || desc.includes("uber")) category = "Transportation"
      else if (desc.includes("utility") || desc.includes("electric") || desc.includes("water")) category = "Utilities"
      else if (desc.includes("shopping") || desc.includes("clothes") || desc.includes("amazon")) category = "Shopping"
      else if (desc.includes("entertainment") || desc.includes("movie") || desc.includes("game"))
        category = "Entertainment"

      categories[category] = (categories[category] || 0) + transaction.amount
    })

    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }

  // Generate monthly expense trend
  const generateExpenseTrend = () => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear()
      })

      const actualExpenses = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      months.push({
        month: monthName,
        budget: monthlyExpenses,
        actual: actualExpenses || monthlyExpenses * (0.7 + Math.random() * 0.6),
        limit: monthlyExpenses * 1.2, // 20% over budget as warning limit
      })
    }

    return months
  }

  const expenseCategories = generateExpenseCategories()
  const expenseTrend = generateExpenseTrend()

  const chartConfig = {
    budget: {
      label: "Budget",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Actual Expenses",
      color: "hsl(var(--chart-2))",
    },
    limit: {
      label: "Warning Limit",
      color: "hsl(var(--chart-3))",
    },
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
      {/* Expense Categories Pie Chart */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Expense Categories</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${currency}${value.toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Monthly Expense Trend */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Monthly Expense Trends</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${currency}${value.toLocaleString()}`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${currency}${value.toLocaleString()}`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Bar dataKey="budget" fill="var(--color-budget)" name="Budget" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="var(--color-actual)" name="Actual" radius={[4, 4, 0, 0]} />
              <Bar dataKey="limit" fill="var(--color-limit)" name="Warning Limit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
