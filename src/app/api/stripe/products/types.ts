export interface PlanRequest {
  id?: string;  // 既存のプランIDがある場合
  price: number; // 円単位
  type: 'subscription'; // サブスクリプションのみに制限
  interval: 'month'; // 月単位のみに制限
  interval_count: 3 | 6 | 9; // 3, 6, 9ヶ月のみに制限
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  active: boolean;
  images?: string[];
  plans: PlanRequest[]; // 複数のプランをサポート
  metadata?: {
    stock?: number;
    status?: string;
    categories?: string; // カンマ区切りの文字列として保存
    [key: string]: unknown;
  };
}
