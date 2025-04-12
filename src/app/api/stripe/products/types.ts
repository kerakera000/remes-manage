export interface PlanPrice {
  price: number; // 円単位
  active: boolean;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  active: boolean;
  images?: string[];
  monthlyPlan: PlanPrice;
  sixMonthPlan: PlanPrice;
  twelveMonthPlan: PlanPrice; // 追加: 12ヶ月プラン
  yearlyPlan: PlanPrice;
  metadata?: {
    stock?: number;
    [key: string]: any;
  };
}
