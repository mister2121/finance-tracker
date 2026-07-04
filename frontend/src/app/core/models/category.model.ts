export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface CategoryRequest {
  name: string;
  type: CategoryType;
}
