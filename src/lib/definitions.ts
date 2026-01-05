export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'exchange';
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  amountSC: number;
  amountUSD: number;
  userId: string;
  exchangeRate?: number;
};
