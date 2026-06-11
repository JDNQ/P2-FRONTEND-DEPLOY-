export interface Variant {
  id: number
  variantName: string
  extraPrice: number
  stock: number
  image?: string | null
  color?: string | null
  size?: string | null
  productId: number
}

export interface ProductImage {
  id: number
  url: string
  isPrimary: boolean
  productId: number
  createdAt: string
}

export interface Product {
  id: number
  productName: string
  description?: string | null
  basePrice: number
  shopId: number | null
  visible: boolean
  variants: Variant[]
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface CreateVariantDto {
  variantName: string
  extraPrice: number
  stock: number
  image?: string
}

export interface ProductImageDto {
  url: string
  isPrimary: boolean
}

export interface CreateProductDto {
  productName: string
  description?: string | null
  basePrice: number
  shopId: number
  variants: CreateVariantDto[]
  images?: ProductImageDto[]
}
