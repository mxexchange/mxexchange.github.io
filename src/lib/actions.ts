'use server';

import {
  analyzeTransactions as analyzeTransactionsFlow,
  type AnalyzeTransactionsInput,
} from '@/ai/flows/compliance-tool-suspicious-transactions';
import { mockTransactions } from './data';
import type { Transaction } from './definitions';

function mapTransactionToInput(tx: Transaction): AnalyzeTransactionsInput['transactions'][0] {
  const amount = tx.amountSC !== 0 ? Math.abs(tx.amountSC) : Math.abs(tx.amountUSD);
  
  let type: 'deposit' | 'withdrawal' | 'exchange' = 'exchange';
  if (tx.type === 'deposit') type = 'deposit';
  if (tx.type === 'withdrawal') type = 'withdrawal';

  return {
    transactionId: tx.id,
    userId: tx.userId,
    transactionType: type,
    amount: amount,
    timestamp: tx.date,
    exchangeRate: tx.exchangeRate,
  };
}

export async function analyzeTransactions() {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network latency

  const analysisInput: AnalyzeTransactionsInput = {
    transactions: mockTransactions.map(mapTransactionToInput),
    largeTransactionThreshold: 1000,
    exchangeRateThreshold: 0.2,
    unusualBehaviorDescription: 'Flag users making multiple large withdrawals in a short period.'
  };

  const result = await analyzeTransactionsFlow(analysisInput);
  return result;
}
