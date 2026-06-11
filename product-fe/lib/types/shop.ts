export interface Shop {
  id: number
  shopName: string
  description: string | null
  ownerId: number
  createdAt: string
  updatedAt: string
}

export interface CreateShopDto {
  shopName: string
  description?: string
}
