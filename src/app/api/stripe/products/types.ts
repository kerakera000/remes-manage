export interface PlanRequest {
  price: number; // 円単位
  interval: 'day' | 'week' | 'month' | 'year'; // サブスクリプションの間隔
  intervalCount?: number; // 間隔の回数（例：2週間なら interval='week', intervalCount=2）
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
