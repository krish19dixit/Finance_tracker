"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
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

interface IncomeChartProps {
  monthlyIncome: number
  transactions: Transaction[]
}

export function IncomeChart({ monthlyIncome, transactions }: IncomeChartProps) {
  const { currency } = useSettings()
  // Generate income trend data for the last 6 months
  const generateIncomeData = () => {
    const months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })

      // Calculate actual income from transactions for this month
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear()
      })

      const actualIncome = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      months.push({
        month: monthName,
        projected: monthlyIncome,
        actual: actualIncome || monthlyIncome * (0.8 + Math.random() * 0.4), // Simulate if no data
        target: monthlyIncome * 1.1, // 10% above projected
      })
    }

    return months
  }

  const incomeData = generateIncomeData()

  const chartConfig = {
    projected: {
      label: "Projected Income",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Actual Income",
      color: "hsl(var(--chart-2))",
    },
    target: {
      label: "Target Income",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Income Trend Line Chart */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Income Trends (Last 6 Months)</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Line
                type="monotone"
                dataKey="projected"
                stroke="var(--color-projected)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Projected"
              />
              <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={3} name="Actual" />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="10 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Income Area Chart */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Income Performance</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={incomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <Area
                type="monotone"
                dataKey="actual"
                stackId="1"
                stroke="var(--color-actual)"
                fill="var(--color-actual)"
                fillOpacity={0.6}
                name="Actual Income"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
