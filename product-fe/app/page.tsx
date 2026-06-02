"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api";
import Link from "next/link";

type Product = {
  id: string;
  productName: string;
  basePrice: number;
  isFavorite?: boolean;
};

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Kiểm tra role và redirect Admin
  useEffect(() => {
    const token = document.cookie.includes("token=");
    const role = localStorage.getItem("role") || "USER";

    if (token && role === "ADMIN") {
      router.push("/dashboard/admin");
    }
  }, [router]);

  // Lấy top sản phẩm
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const allProducts = (await getProducts()) as Product[];
        // Lấy tối đa 10 sản phẩm
        const topProducts = allProducts.slice(0, 10);
        setProducts(topProducts);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm nổi bật", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-[#1e3a6e] to-blue-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6">TL Market</h1>
          <p className="text-2xl mb-8">Thời trang chất lượng - Giá tốt mỗi ngày</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-[#1e3a6e] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition text-lg"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>

      {/* Top Sản Phẩm Nổi Bật */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">🔥 Sản Phẩm Nổi Bật</h2>
          <Link href="/products" className="text-[#1e3a6e] hover:underline font-medium">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl">Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Chưa có sản phẩm nào.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    HOT
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-2 min-h-13 group-hover:text-[#1e3a6e]">
                    {product.productName}
                  </h3>
                  <p className="text-2xl font-bold text-red-600 mt-3">
                    {product.basePrice.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}