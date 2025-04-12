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
    
    if (!body.name) {
      return NextResponse.json(
        { error: '商品名は必須です' }, 
        { status: 400 }
      );
    }

    if (!body.monthlyPlan.active && !body.sixMonthPlan.active && !body.twelveMonthPlan.active && !body.yearlyPlan.active) {
      return NextResponse.json(
        { error: '少なくとも1つのサブスクリプションプランを有効にしてください' }, 
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

    const prices = [];

    if (body.monthlyPlan.active && body.monthlyPlan.price > 0) {
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: body.monthlyPlan.price,
        currency: 'jpy',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
        billing_scheme: 'per_unit',
        transform_quantity: {
          divide_by: 6,
          round: 'up',
        },
        metadata: {
          plan_type: 'monthly',
        },
      });
      prices.push(monthlyPrice);
    }

    if (body.sixMonthPlan.active && body.sixMonthPlan.price > 0) {
      const sixMonthPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: body.sixMonthPlan.price,
        currency: 'jpy',
        recurring: {
          interval: 'month',
          interval_count: 6,
        },
        billing_scheme: 'per_unit',
        transform_quantity: {
          divide_by: 6,
          round: 'up',
        },
        metadata: {
          plan_type: 'six_month',
        },
      });
      prices.push(sixMonthPrice);
    }

    if (body.twelveMonthPlan.active && body.twelveMonthPlan.price > 0) {
      const twelveMonthPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: body.twelveMonthPlan.price,
        currency: 'jpy',
        recurring: {
          interval: 'month',
          interval_count: 12,
        },
        billing_scheme: 'per_unit',
        transform_quantity: {
          divide_by: 6,
          round: 'up',
        },
        metadata: {
          plan_type: 'twelve_month',
        },
      });
      prices.push(twelveMonthPrice);
    }

    if (body.yearlyPlan.active && body.yearlyPlan.price > 0) {
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: body.yearlyPlan.price,
        currency: 'jpy',
        recurring: {
          interval: 'year',
          interval_count: 1,
        },
        billing_scheme: 'per_unit',
        transform_quantity: {
          divide_by: 6,
          round: 'up',
        },
        metadata: {
          plan_type: 'yearly',
        },
      });
      prices.push(yearlyPrice);
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      prices: prices.map(price => ({
        id: price.id,
        unit_amount: price.unit_amount,
        recurring: {
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
        },
        metadata: price.metadata,
      })),
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
