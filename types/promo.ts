export interface Promo {
  id: string
  title: string
  description: string
  code: string
  discount: number
  discountType: "percentage" | "fixed"
  minOrder: number
  maxUses: number
  currentUses: number
  startDate: string
  endDate: string
  isActive: boolean
  seller: string
  category: string // This will be used as the "batch name"
  image: string
  createdAt: string
}
