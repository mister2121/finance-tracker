export enum AccountType {
  BANK = 'BANK',
  CASH = 'CASH',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export interface DashboardAccount {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
}
