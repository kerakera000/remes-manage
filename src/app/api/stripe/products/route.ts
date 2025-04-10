import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import type { CreateProductRequest } from './types';

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateProductRequest;
    
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: '商品名と価格は必須です' }, 
        { status: 400 }
      );
    }

    const product = await stripe.products.create({
      name: body.name,
      description: body.description,
      active: body.active,
      images: body.images,
      metadata: body.metadata,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: body.price,
      currency: 'jpy',
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      price: {
        id: price.id,
        unit_amount: price.unit_amount,
      },
      images: product.images,
      metadata: product.metadata,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: '商品の作成中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
