export interface PlanRequest {
  id?: string;  // 既存のプランIDがある場合
  price: number; // 円単位
  type: 'one_time' | 'subscription'; // 単発購入かサブスクリプションか
  interval?: 'day' | 'week' | 'month' | 'year'; // サブスクリプションの間隔（サブスクリプションの場合のみ）
  planPeriod?: number; // プラン期間の値
  planPeriodUnit?: 'day' | 'month'; // プラン期間の単位
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
