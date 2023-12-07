import React, { createContext, useState } from 'react';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);

  // Function to update balance
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <BalanceContext.Provider value={{ balance, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};