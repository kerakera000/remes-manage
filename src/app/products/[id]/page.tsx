import React from "react";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/features/products/edit-product-form";

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : '';
    
    const res = await fetch(`${baseUrl}/api/stripe/products/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('商品の取得に失敗しました');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">商品詳細: {product.name}</h1>
        <p className="text-muted-foreground">ID: {product.id}</p>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}
