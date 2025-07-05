"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  getCurrencySymbol: (code: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState<string>('USD'); // Default to USD code

  useEffect(() => {
    const storedCurrencyCode = localStorage.getItem('appCurrencyCode');
    if (storedCurrencyCode) {
      setCurrencyCode(storedCurrencyCode);
    }
  }, []);

  const updateCurrencyCode = (newCode: string) => {
    setCurrencyCode(newCode);
    localStorage.setItem('appCurrencyCode', newCode);
  };

  const getCurrencySymbol = (code: string): string => {
    switch (code) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      case 'INR':
        return '₹';
      default:
        return '$'; // Fallback
    }
  };

  return (
    <SettingsContext.Provider value={{ currencyCode, setCurrencyCode: updateCurrencyCode, getCurrencySymbol }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};