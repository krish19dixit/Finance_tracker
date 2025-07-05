"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialData } from "@/hooks/use-financial-data";
import { useSettings } from "@/lib/context/SettingsContext";
import { TransactionCard } from "@/components/transaction-card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HistoryPage() {
  const { financialData, loading, updateTransaction, deleteTransaction } = useFinancialData();
  const { currencyCode } = useSettings();

  console.log('HistoryPage - financialData.transactions:', financialData.transactions);
  console.log('HistoryPage - financialData.transactions.length:', financialData.transactions.length);

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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                <p className="text-gray-600 mt-1">All your past financial transactions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              {financialData.transactions.length > 0 ? (
                financialData.transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    onUpdate={updateTransaction}
                    onDelete={deleteTransaction}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No transactions recorded yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
