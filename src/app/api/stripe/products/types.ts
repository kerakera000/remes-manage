export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number; // 円単位
  active: boolean;
  images?: string[];
  interval: 'day' | 'week' | 'month' | 'year'; // サブスクリプションの間隔
  intervalCount?: number; // 間隔の回数（例：2週間なら interval='week', intervalCount=2）
  metadata?: {
    stock?: number;
    [key: string]: any;
  };
}
