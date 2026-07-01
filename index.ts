export interface Friend {
  id: string;
  name: string;
  avatarColor: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string; // Friend ID
  participants: string[]; // Array of Friend IDs
  date: string;
}

export interface Transaction {
  from: string; // Friend ID
  to: string; // Friend ID
  amount: number;
}
