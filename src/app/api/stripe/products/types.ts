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
  yearlyPlan: PlanPrice;
  metadata?: {
    stock?: number;
    [key: string]: any;
  };
}
