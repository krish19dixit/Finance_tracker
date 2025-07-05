"use client"

import type React from "react"

import { useState } from "react"
import { Edit3, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useSettings } from "@/lib/context/SettingsContext"

interface EditableMetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: "blue" | "green" | "red" | "purple"
  onSave: (value: number) => void
  description: string
  large?: boolean
}

export function EditableMetricCard({
  title,
  value,
  icon,
  color,
  onSave,
  description,
  large = false,
}: EditableMetricCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value.toString())
  const { currencyCode } = useSettings()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const colorClasses = {
    blue: "text-blue-600 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    red: "text-red-600 hover:bg-red-50",
    purple: "text-purple-600 hover:bg-purple-50",
  }

  const handleSave = () => {
    const newValue = Number.parseFloat(tempValue)
    if (isNaN(newValue)) {
      alert("Please enter a valid number")
      return
    }
    onSave(newValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value.toString())
    setIsEditing(false)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={colorClasses[color]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={`${large ? "text-2xl" : "text-xl"} font-bold h-12 ${colorClasses[color]}`}
                placeholder="0"
              />
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className={`${large ? "text-2xl" : "text-xl"} font-bold ${colorClasses[color]}`}>
                {formatCurrency(value)}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(true)
                  setTempValue(value.toString())
                }}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}
