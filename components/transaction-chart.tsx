"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
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

interface TransactionChartProps {
  transactions: Transaction[]
}

export function TransactionChart({ transactions }: TransactionChartProps) {
  const { currency } = useSettings()
  // Process transactions for daily flow chart
  const generateDailyFlow = () => {
    const dailyData: Record<string, { date: string; income: number; expenses: number; net: number }> = {}

    transactions.forEach((transaction) => {
      const date = transaction.date
      if (!dailyData[date]) {
        dailyData[date] = { date, income: 0, expenses: 0, net: 0 }
      }

      if (transaction.type === "income") {
        dailyData[date].income += transaction.amount
      } else {
        dailyData[date].expenses += transaction.amount
      }

      dailyData[date].net = dailyData[date].income - dailyData[date].expenses
    })

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30) // Last 30 days
  }

  // Generate transaction scatter data
  const generateScatterData = () => {
    return transactions.map((transaction, index) => ({
      x: index,
      y: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date,
    }))
  }

  const dailyFlow = generateDailyFlow()
  const scatterData = generateScatterData()

  const chartConfig = {
    income: {
      label: "Daily Income",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Daily Expenses",
      color: "hsl(var(--chart-2))",
    },
    net: {
      label: "Net Flow",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Daily Cash Flow */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Daily Cash Flow (Last 30 Days)</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyFlow} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis tickFormatter={(value) => `${currency}${value.toLocaleString()}`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${currency}${value.toLocaleString()}`,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="net" stroke="var(--color-net)" strokeWidth={3} name="Net Flow" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Transaction Scatter Plot */}
      <div className="h-64">
        <h4 className="text-sm font-medium mb-4">Transaction Distribution</h4>
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={scatterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Transaction #" />
              <YAxis type="number" dataKey="y" name="Amount" tickFormatter={(value) => `${currency}${value}`} />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded shadow">
                        <p className="font-medium">{data.description}</p>
                        <p className="text-sm text-gray-600">{data.date}</p>
                        <p className={`font-semibold ${data.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {currency}{data.y.toLocaleString()} ({data.type})
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter
                name="Income"
                dataKey="y"
                fill="var(--color-income)"
                data={scatterData.filter((d) => d.type === "income")}
              />
              <Scatter
                name="Expenses"
                dataKey="y"
                fill="var(--color-expenses)"
                data={scatterData.filter((d) => d.type === "expense")}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
