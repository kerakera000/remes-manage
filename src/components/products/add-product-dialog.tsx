"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AddProductForm } from "@/components/features/products/add-product-form"
import { useRouter } from "next/navigation"
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Cookies from 'js-cookie'

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
        Cookies.set('auth-session', 'true', { expires: 1 })
      } else {
        setIsAuthenticated(false)
        Cookies.remove('auth-session')
      }
    })
    
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (values: any) => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/products');
      return;
    }
    
    try {
      const response = await fetch('/api/stripe/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          active: values.status === 'active',
          monthlyPlan: {
            price: values.monthlyPlan.price,
            active: values.monthlyPlan.active,
          },
          sixMonthPlan: {
            price: values.sixMonthPlan.price,
            active: values.sixMonthPlan.active,
          },
          twelveMonthPlan: {
            price: values.twelveMonthPlan.price,
            active: values.twelveMonthPlan.active,
          },
          yearlyPlan: {
            price: values.yearlyPlan.price,
            active: values.yearlyPlan.active,
          },
          metadata: {
            stock: values.stock,
            status: values.status,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('商品の追加に失敗しました')
      }

      setOpen(false)
      
      router.refresh()
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>商品を追加</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>商品を追加</DialogTitle>
        </DialogHeader>
        <AddProductForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}
