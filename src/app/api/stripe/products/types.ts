export interface PlanRequest {
  id?: string;  // 既存のプランIDがある場合
  price: number; // 円単位
  type: 'subscription'; // サブスクリプションのみに制限
  interval: 'month'; // 月単位のみに制限
  subscription_period: 3 | 6 | 12; // 3, 6, 12ヶ月のサブスクリプション期間
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
