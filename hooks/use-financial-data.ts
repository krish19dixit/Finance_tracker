"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface FinancialData {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  transactions: Transaction[]
}

export interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  type: "income" | "expense"
  createdAt?: string
}

export function useFinancialData() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const calculateMetrics = (transactions: Transaction[], initialBalance: number) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'income' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, initialBalance);

    return { totalBalance, monthlyIncome, monthlyExpenses };
  }

  const loadFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      const [transactionsRes, settingsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/settings'),
      ]);

      if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
      if (!settingsRes.ok) throw new Error('Failed to fetch settings');

      const { data: transactions } = await transactionsRes.json();
      const { data: settings } = await settingsRes.json();

      const metrics = calculateMetrics(transactions, settings.totalBalance);
      setFinancialData({
        ...metrics,
        monthlyIncome: settings.monthlyIncome, // Use setting for monthly income target
        monthlyExpenses: settings.monthlyExpenses, // Use setting for monthly expenses target
        transactions: transactions,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
      setFinancialData({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        transactions: [],
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  const addTransaction = async (transaction: Omit<Transaction, "_id" | "createdAt">) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      await loadFinancialData();
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (id: string, updatedTransaction: Partial<Omit<Transaction, "_id" | "createdAt">>) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransaction),
      });
      if (!res.ok) throw new Error('Failed to update transaction');
      await loadFinancialData();
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      await loadFinancialData();
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const updateMetric = async (metric: keyof Omit<FinancialData, "transactions">, value: number) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [metric]: value }),
      });
      if (!res.ok) throw new Error(`Failed to update ${metric}`);
      await loadFinancialData(); // Reload data to reflect changes
      toast({
        title: "Success",
        description: `${metric} updated successfully`,
      });
    } catch (error) {
      console.error(`Error updating ${metric}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${metric}`,
        variant: "destructive",
      });
    }
  };

  return {
    financialData,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    reloadFinancialData: loadFinancialData,
    updateMetric,
  };
}