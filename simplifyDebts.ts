import { Expense, Transaction } from '../types';

export const calculateBalances = (expenses: Expense[], friendIds: string[]): Record<string, number> => {
  const balances: Record<string, number> = {};
  friendIds.forEach(id => (balances[id] = 0));

  expenses.forEach(expense => {
    // Check if the payer exists in our friendIds (just in case they were deleted but expenses remain, though we should handle this in state)
    if (balances[expense.paidBy] !== undefined) {
      balances[expense.paidBy] += expense.amount;
    }
    
    // For MVP, split equally among participants
    if (expense.participants.length > 0) {
      const splitAmount = expense.amount / expense.participants.length;
      expense.participants.forEach(participantId => {
        if (balances[participantId] !== undefined) {
          balances[participantId] -= splitAmount;
        }
      });
    }
  });

  return balances;
};

export const simplifyDebts = (balances: Record<string, number>): Transaction[] => {
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const [id, balance] of Object.entries(balances)) {
    if (balance < -0.01) { // Floating point tolerance
      debtors.push({ id, amount: -balance });
    } else if (balance > 0.01) {
      creditors.push({ id, amount: balance });
    }
  }

  // Sort descending by amount to try to match largest debts first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: Transaction[] = [];
  
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const minAmount = Math.min(debtor.amount, creditor.amount);

    // Only create a transaction if the amount is significant
    if (minAmount > 0.01) {
      transactions.push({
        from: debtor.id,
        to: creditor.id,
        amount: minAmount,
      });
    }

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    if (Math.abs(debtor.amount) < 0.01) {
      d++;
    }
    if (Math.abs(creditor.amount) < 0.01) {
      c++;
    }
  }

  return transactions;
};
