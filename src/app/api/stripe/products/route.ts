import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import type { CreateProductRequest } from './types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const formattedProducts = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          expand: ['data.product'],
        });

        const price = prices.data[0];
        
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          price: price ? price.unit_amount || 0 : 0,
          stock: product.metadata?.stock ? parseInt(product.metadata.stock) : 0,
          status: product.metadata?.status || (product.active ? 'active' : 'draft'),
          createdAt: new Date(product.created * 1000),
          recurring: price?.recurring ? {
            interval: price.recurring.interval,
            interval_count: price.recurring.interval_count,
          } : null,
        };
      })
    );

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: '商品の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateProductRequest;
    
    if (!body.name || !body.price || !body.interval) {
      return NextResponse.json(
        { error: '商品名、価格、サブスクリプション間隔は必須です' }, 
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
      recurring: {
        interval: body.interval,
        interval_count: body.intervalCount || 1,
      },
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      price: {
        id: price.id,
        unit_amount: price.unit_amount,
        recurring: {
          interval: body.interval,
          interval_count: body.intervalCount || 1,
        },
      },
      images: product.images,
      metadata: product.metadata,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating subscription product:', error);
    return NextResponse.json(
      { error: 'サブスクリプション商品の作成中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
