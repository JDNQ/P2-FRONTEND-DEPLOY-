export interface Shop {
  id: number
  shopName: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface CreateShopDto {
  shopName: string
  description?: string
}
