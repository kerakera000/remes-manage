"use client"

import * as React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AddProductForm } from "@/components/features/products/add-product-form"
import { useRouter } from "next/navigation"

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: any) => {
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
