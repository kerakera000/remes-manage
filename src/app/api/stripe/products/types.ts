export interface PlanRequest {
  price: number; // 円単位
  type: 'one_time' | 'subscription'; // 単発購入かサブスクリプションか
  interval?: 'day' | 'week' | 'month' | 'year'; // サブスクリプションの間隔（サブスクリプションの場合のみ）
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  active: boolean;
  images?: string[];
  plans: PlanRequest[]; // 複数のプランをサポート
  metadata?: {
    stock?: number;
    [key: string]: unknown;
  };
}
