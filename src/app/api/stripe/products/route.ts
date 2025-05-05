import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import type { CreateProductRequest } from './types';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

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
        
        const formattedPrices = prices.data.map(price => ({
          id: price.id,
          unit_amount: price.unit_amount || 0,
          recurring: price.recurring ? {
            interval: price.recurring.interval,
            interval_count: price.recurring.interval_count,
          } : null,
        }));

        const defaultPrice = prices.data[0];
        
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          price: defaultPrice ? defaultPrice.unit_amount || 0 : 0, // 後方互換性のため
          stock: product.metadata?.stock ? parseInt(product.metadata.stock) : 0,
          status: product.metadata?.status || (product.active ? 'active' : 'draft'),
          categories: product.metadata?.categories ? product.metadata.categories.split(',') : [],
          createdAt: new Date(product.created * 1000),
          recurring: defaultPrice?.recurring ? {
            interval: defaultPrice.recurring.interval,
            interval_count: defaultPrice.recurring.interval_count,
          } : null,
          prices: formattedPrices, // すべてのプラン情報
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
    
    if (!body.name || !body.plans.length) {
      return NextResponse.json(
        { error: '商品名およびプランは必須です' }, 
        { status: 400 }
      );
    }

    const metadata: Record<string, string> = {
      ...(body.metadata as Record<string, string> || {})
    };
    
    if (body.plans[0].planPeriod) {
      metadata.planPeriod = body.plans[0].planPeriod.toString();
    }
    
    if (body.plans[0].planPeriodUnit) {
      metadata.planPeriodUnit = body.plans[0].planPeriodUnit;
    }

    const product = await stripe.products.create({
      name: body.name,
      description: body.description,
      active: body.active,
      images: body.images,
      metadata: metadata,
    });

    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      stock: body.metadata?.stock ? parseInt(String(body.metadata.stock)) : 0,
      status: body.metadata?.status || (product.active ? 'active' : 'draft'),
      categories: body.metadata?.categories ? String(body.metadata.categories).split(',') : [],
      createdAt: new Date(),
      planPeriod: body.plans[0].planPeriod?.toString() || null,
      planPeriodUnit: body.plans[0].planPeriodUnit || null,
    };
    
    try {
      await setDoc(doc(db, 'products', product.id), productData);
    } catch (error) {
      console.error('Error saving to Firestore:', error);
    }
    
    const prices = await Promise.all(
      body.plans.map(plan => {
        const priceData: any = {
          product: product.id,
          unit_amount: plan.price,
          currency: 'jpy',
        };
        
        if (plan.type === 'subscription' && plan.interval) {
          priceData.recurring = {
            interval: plan.interval,
            interval_count: 1,
          };
        }
        
        return stripe.prices.create(priceData);
      })
    );

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
          interval_count: price.recurring?.interval_count || 1,
        },
      })),
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
