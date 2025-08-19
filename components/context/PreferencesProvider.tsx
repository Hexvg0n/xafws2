// components/context/PreferencesProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Rates {
  [key: string]: number;
}

interface PreferencesContextType {
  preferredAgent: string;
  preferredCurrency: string;
  currencyRates: Rates;
  isLoading: boolean;
  convertPrice: (priceCNY: number) => string;
  generateAgentLink: (sourceUrl: string) => Promise<string>;
  // Nowe funkcje do aktualizacji stanu
  updateAgent: (agent: string) => void;
  updateCurrency: (currency: string) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferredAgent, setPreferredAgent] = useState('acbuy');
  const [preferredCurrency, setPreferredCurrency] = useState('PLN');
  const [currencyRates, setCurrencyRates] = useState<Rates>({});
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ratesRes, profileRes] = await Promise.all([
        fetch('/api/currency/rates'),
        status === 'authenticated' ? fetch('/api/profile') : Promise.resolve(null)
      ]);

      if (ratesRes.ok) {
        setCurrencyRates(await ratesRes.json());
      }

      if (profileRes && profileRes.ok) {
        const profileData = await profileRes.json();
        setPreferredAgent(profileData.preferredAgent || 'pandabuy');
        setPreferredCurrency(profileData.preferredCurrency || 'PLN');
      }
    } catch (error) {
      console.error("Failed to load preferences data", error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);
  
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const convertPrice = (priceCNY: number): string => {
    if (!priceCNY || !currencyRates[preferredCurrency]) {
      return `${Number(priceCNY).toFixed(2)} CNY`;
    }
    const rate = currencyRates[preferredCurrency];
    const converted = priceCNY * rate;
    return `${converted.toFixed(2)} ${preferredCurrency}`;
  };

  const generateAgentLink = async (sourceUrl: string): Promise<string> => {
    if (!preferredAgent || !sourceUrl) return sourceUrl;
    try {
      const res = await fetch('/api/converter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: sourceUrl }),
      });
      if (res.ok) {
          const data = await res.json();
          const agentLink = data.convertedLinks.find((link: any) => link.key === preferredAgent);
          return agentLink ? agentLink.url : sourceUrl;
      }
      return sourceUrl;
    } catch (error) {
      console.error("Link conversion failed", error);
      return sourceUrl;
    }
  };

  return (
    <PreferencesContext.Provider value={{ 
      preferredAgent, 
      preferredCurrency, 
      currencyRates, 
      isLoading, 
      convertPrice, 
      generateAgentLink,
      updateAgent: setPreferredAgent,       
      updateCurrency: setPreferredCurrency, 
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};