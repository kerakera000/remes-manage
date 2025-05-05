import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import type { CreateProductRequest } from '../../types';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await stripe.products.retrieve(params.id, {
      expand: ['default_price'],
    });

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
    
    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      price: defaultPrice ? defaultPrice.unit_amount || 0 : 0,
      stock: product.metadata?.stock ? parseInt(product.metadata.stock) : 0,
      status: product.metadata?.status || (product.active ? 'active' : 'draft'),
      categories: product.metadata?.categories ? product.metadata.categories.split(',') : [],
      createdAt: new Date(product.created * 1000),
      recurring: defaultPrice?.recurring ? {
        interval: defaultPrice.recurring.interval,
        interval_count: defaultPrice.recurring.interval_count,
      } : null,
      prices: formattedPrices,
      images: product.images || [],
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: '商品の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as CreateProductRequest;
    
    if (!body.name) {
      return NextResponse.json(
        { error: '商品名は必須です' }, 
        { status: 400 }
      );
    }

    const product = await stripe.products.update(params.id, {
      name: body.name,
      description: body.description,
      active: body.active,
      images: body.images,
      metadata: body.metadata as Record<string, string>,
    });

    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      stock: body.metadata?.stock ? parseInt(String(body.metadata.stock)) : 0,
      status: body.metadata?.status || (product.active ? 'active' : 'draft'),
      categories: body.metadata?.categories ? String(body.metadata.categories).split(',') : [],
      updatedAt: new Date(),
      rentalPeriod: body.plans[0].rentalPeriod?.toString() || null,
      rentalUnit: body.plans[0].rentalUnit || null,
    };
    
    try {
      await setDoc(doc(db, 'products', product.id), productData, { merge: true });
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
    
    const updatedPrices = await Promise.all(
      body.plans.map(async plan => {
        if (plan.id) {
          await stripe.prices.update(plan.id, { active: false });
        }
        
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
        
        if (plan.rentalPeriod && plan.rentalUnit) {
          if (!product.metadata) product.metadata = {};
          product.metadata.rentalPeriod = plan.rentalPeriod.toString();
          product.metadata.rentalUnit = plan.rentalUnit;
        }
        
        return stripe.prices.create(priceData);
      })
    );

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      prices: updatedPrices.map(price => ({
        id: price.id,
        unit_amount: price.unit_amount,
        recurring: price.recurring ? {
          interval: price.recurring.interval,
          interval_count: price.recurring.interval_count || 1,
        } : null,
      })),
      images: product.images,
      metadata: product.metadata,
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: '商品の更新中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
