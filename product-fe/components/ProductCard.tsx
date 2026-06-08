"use client"
import { useRouter } from "next/navigation"

type ProductCardProps = {
    id: string
    name: string
    price: number
    salePrice: number
    rating: number
    soldCount: number
    image: string
    badge?: string
    isFlashSale?: boolean
}

export default function ProductCard({
    id,
    name,
    price,
    salePrice,
    rating,
    soldCount,
    image,
    badge,
}: ProductCardProps) {
    const router = useRouter()
    const discount = Math.round(((price - salePrice) / price) * 100)

    return (
        <div
            className="bg-white rounded-xl border hover:shadow-md transition cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
        >
            <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={name}
                    className="w-full h-40 object-cover rounded-t-xl"
                    onError={(e) => {
                        // If backend image URL is deleted/broken, fall back to default image.
                        ; (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1592286927505-1fed5016107c?w=400&h=400&fit=crop"
                    }}
                />
                {badge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                        {badge}
                    </span>
                )}
                {discount > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                        -{discount}%
                    </span>
                )}
            </div>
            <div className="p-3">
                <p className="text-sm font-medium line-clamp-2 text-gray-800">{name}</p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-amber-400 text-xs">⭐</span>
                    <span className="text-xs text-gray-500">
                        {rating} | Đã bán {soldCount}
                    </span>
                </div>
                <div className="mt-1">
                    <span className="text-red-600 font-black">{salePrice.toLocaleString("vi-VN")} ₫</span>
                    {price > salePrice && (
                        <span className="text-xs line-through text-gray-400 ml-2">
                            {price.toLocaleString("vi-VN")} ₫
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

