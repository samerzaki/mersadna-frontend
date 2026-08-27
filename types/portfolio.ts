// Portfolio API types

export type PortfolioAssetType = 'gold' | 'silver' | 'currency';
export type PortfolioFilterType = 'all' | PortfolioAssetType;

export interface PortfolioItem {
  id: number;
  type: PortfolioAssetType;
  name: string;
  amount: number;
  buy_price: number;
  purchase_date: string;
  karat: number | null;
  purity: number | null;
  currency_code: string | null;
  notes: string | null;
  current_price: number;
  current_value: number;
  cost_basis: number;
  profit_loss: number;
  profit_loss_percent: number;
  created_at: string;
}

export interface PortfolioAllocation {
  value: number;
  percentage: number;
}

export interface PortfolioPerformer {
  id: number;
  name: string;
  profit_loss_percent: number;
}

export interface PortfolioSummary {
  total_cost_basis: number;
  total_current_value: number;
  total_profit_loss: number;
  profit_loss_percent: number;
  allocation: {
    gold: PortfolioAllocation;
    silver: PortfolioAllocation;
    currency: PortfolioAllocation;
  };
  best_performer: PortfolioPerformer | null;
  worst_performer: PortfolioPerformer | null;
}

export interface PortfolioCounts {
  all: number;
  gold: number;
  silver: number;
  currency: number;
}

export interface PortfolioIndexResponse {
  status: number;
  success: boolean;
  data: PortfolioItem[];
  meta: {
    summary: PortfolioSummary;
    counts: PortfolioCounts;
  };
}

export interface PortfolioItemResponse {
  status: number;
  success: boolean;
  data: PortfolioItem;
  meta: {
    message: string;
  };
}

export interface CreatePortfolioItemRequest {
  type: PortfolioAssetType;
  name: string;
  amount: number;
  buy_price: number;
  purchase_date: string;
  karat?: number;
  purity?: number;
  currency_code?: string;
  notes?: string;
}

export type UpdatePortfolioItemRequest = CreatePortfolioItemRequest;
