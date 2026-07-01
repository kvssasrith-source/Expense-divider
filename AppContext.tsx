import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Friend, Expense } from '../types';

interface AppState {
  friends: Friend[];
  expenses: Expense[];
  addFriend: (name: string) => void;
  removeFriend: (id: string) => void;
  addExpense: (title: string, amount: number, paidBy: string, participants: string[]) => void;
  removeExpense: (id: string) => void;
  resetExpenses: () => void;
  currency: string;
  setCurrency: (c: string) => void;
}

export const AppContext = createContext<AppState>({
  friends: [],
  expenses: [],
  addFriend: () => {},
  removeFriend: () => {},
  addExpense: () => {},
  removeExpense: () => {},
  resetExpenses: () => {},
  currency: '$',
  setCurrency: () => {},
});

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrencyState] = useState<string>('$');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFriends = await AsyncStorage.getItem('@friends');
        const storedExpenses = await AsyncStorage.getItem('@expenses');
        const storedCurrency = await AsyncStorage.getItem('@currency');
        if (storedFriends) setFriends(JSON.parse(storedFriends));
        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        if (storedCurrency) setCurrencyState(storedCurrency);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  const setCurrency = async (c: string) => {
    setCurrencyState(c);
    await AsyncStorage.setItem('@currency', c);
  };

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@friends', JSON.stringify(friends));
        await AsyncStorage.setItem('@expenses', JSON.stringify(expenses));
      } catch (e) {
        console.error("Failed to save data", e);
      }
    };
    saveData();
  }, [friends, expenses]);

  const addFriend = (name: string) => {
    const newFriend: Friend = {
      id: generateId(),
      name,
      avatarColor: generateColor(),
    };
    setFriends([...friends, newFriend]);
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter(f => f.id !== id));
    // Optionally: remove or flag expenses involving this friend
  };

  const addExpense = (title: string, amount: number, paidBy: string, participants: string[]) => {
    const newExpense: Expense = {
      id: generateId(),
      title,
      amount,
      paidBy,
      participants,
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const resetExpenses = () => {
    setExpenses([]);
  };

  return (
    <AppContext.Provider value={{ friends, expenses, addFriend, removeFriend, addExpense, removeExpense, resetExpenses, currency, setCurrency }}>
      {children}
    </AppContext.Provider>
  );
};
