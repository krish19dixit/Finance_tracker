"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSettings } from "@/lib/context/SettingsContext"

interface BalanceChartProps {
  balance: number
  income: number
  expenses: number
}

export function BalanceChart({ balance, income, expenses }: BalanceChartProps) {
  const { currency } = useSettings()
  const pieData = [
    { name: "Available Balance", value: balance, color: "#10b981" },
    { name: "Monthly Expenses", value: expenses, color: "#ef4444" },
  ]

  const barData = [
    {
      category: "This Month",
      income: income,
      expenses: expenses,
      balance: balance,
    },
  ]

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-2))",
    },
    balance: {
      label: "Balance",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Balance Distribution Pie Chart */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Balance Distribution</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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

      {/* Financial Summary Bar Chart */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Financial Summary</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `${currency}${value.toLocaleString()}`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${currency}${value.toLocaleString()}`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Legend />
              <Bar dataKey="income" fill="var(--color-income)" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" name="Expenses" radius={[4, 4, 0, 0]} />
              <Bar dataKey="balance" fill="var(--color-balance)" name="Balance" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
