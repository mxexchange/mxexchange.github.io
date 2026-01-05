// 'use server';

/**
 * @fileOverview A compliance tool to analyze transactions and alert administrators to any unusual, suspicious, or large transactions.
 *
 * - analyzeTransactions - A function that analyzes transactions and returns a compliance report.
 * - AnalyzeTransactionsInput - The input type for the analyzeTransactions function.
 * - AnalyzeTransactionsOutput - The return type for the analyzeTransactions function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTransactionsInputSchema = z.object({
  transactions: z.array(
    z.object({
      transactionId: z.string().describe('The unique ID of the transaction.'),
      userId: z.string().describe('The ID of the user involved in the transaction.'),
      transactionType: z
        .enum(['deposit', 'withdrawal', 'exchange'])
        .describe('The type of transaction.'),
      amount: z.number().describe('The amount of sweeps coins or USD involved.'),
      timestamp: z.string().describe('The timestamp of the transaction.'),
      exchangeRate: z.number().optional().describe('The exchange rate used if applicable.'),
    })
  ).describe('An array of transaction objects to analyze.'),
  exchangeRateThreshold: z
    .number()
    .default(0.2)
    .describe('The percentage threshold for flagging unusual exchange rates.'),
  largeTransactionThreshold: z
    .number()
    .default(1000)
    .describe('The amount threshold for flagging large transactions.'),
  unusualBehaviorDescription: z
    .string()
    .optional()
    .describe('Description of known user behaviors to flag as unusual'),
});

export type AnalyzeTransactionsInput = z.infer<typeof AnalyzeTransactionsInputSchema>;

const AnalyzeTransactionsOutputSchema = z.object({
  complianceReport: z.string().describe('A detailed report of any suspicious transactions.'),
  flaggedTransactions: z.array(
    z.object({
      transactionId: z.string().describe('The unique ID of the flagged transaction.'),
      reason: z.string().describe('The reason why the transaction was flagged.'),
    })
  ).describe('An array of flagged transaction objects with reasons.'),
});

export type AnalyzeTransactionsOutput = z.infer<typeof AnalyzeTransactionsOutputSchema>;

export async function analyzeTransactions(
  input: AnalyzeTransactionsInput
): Promise<AnalyzeTransactionsOutput> {
  return analyzeTransactionsFlow(input);
}

const analyzeTransactionsPrompt = ai.definePrompt({
  name: 'analyzeTransactionsPrompt',
  input: {schema: AnalyzeTransactionsInputSchema},
  output: {schema: AnalyzeTransactionsOutputSchema},
  prompt: `You are a compliance officer tasked with analyzing transactions for a sweeps coin exchange.

  Your goal is to identify any unusual, suspicious, or large transactions that may require further investigation.

  Here are the transactions to analyze:
  {{#each transactions}}
  - Transaction ID: {{transactionId}}, User ID: {{userId}}, Type: {{transactionType}}, Amount: {{amount}}, Timestamp: {{timestamp}}{{#if exchangeRate}}, Exchange Rate: {{exchangeRate}}{{/if}}
  {{/each}}

  Consider the following factors when analyzing transactions:
  - Large transactions exceeding the threshold of ${{largeTransactionThreshold}}.
  - Unusual exchange rates that deviate by more than {{exchangeRateThreshold}} from the norm.
  - Any other suspicious patterns or anomalies in the transaction data.
  - {{unusualBehaviorDescription}}

  Generate a compliance report summarizing your findings and flag any transactions that warrant further investigation.
  Include the transactionId and the reason it was flagged.
  `, 
});

const analyzeTransactionsFlow = ai.defineFlow(
  {
    name: 'analyzeTransactionsFlow',
    inputSchema: AnalyzeTransactionsInputSchema,
    outputSchema: AnalyzeTransactionsOutputSchema,
  },
  async input => {
    const {output} = await analyzeTransactionsPrompt(input);
    return output!;
  }
);
