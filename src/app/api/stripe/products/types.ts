export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number; // 円単位
  active: boolean;
  images?: string[];
  metadata?: {
    stock?: number;
    [key: string]: any;
  };
}
