"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";


type Product = {
  id: string;
  productName: string;
  basePrice: number;
  variants: { stock: number }[];
  createdAt?: string;
};


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/products");
        if (!mounted) return;
        setProducts(res.data ?? []);
      } catch (e) {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : "Không thể tải sản phẩm";
        setError(message);

      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalVariants = products.reduce(
      (sum, p) => sum + (p.variants?.length ?? 0),
      0
    );
    const totalStock = products.reduce(
      (sum, p) =>
        sum + (p.variants ?? []).reduce((s, v) => s + (v.stock ?? 0), 0),
      0
    );
    return { totalProducts, totalVariants, totalStock };
  }, [products]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Quản lý sản phẩm & variants</p>
        </div>
        <button
          onClick={() => router.push("/products/new")}
          className="inline-flex items-center justify-center rounded-md bg-[#533AB7] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tổng sản phẩm</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tổng variants</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalVariants}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tổng stock</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalStock}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">Bảng sản phẩm</p>
        </div>

        {loading ? (
          <div className="px-4 pb-6 text-sm text-gray-600">Đang tải...</div>
        ) : error ? (
          <div className="px-4 pb-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600">
                <tr>
                  <th className="px-4 py-3">Tên sản phẩm</th>
                  <th className="px-4 py-3">Giá gốc</th>
                  <th className="px-4 py-3">Số variants</th>
                  <th className="px-4 py-3">Tổng stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => {
                  const totalVariants = p.variants?.length ?? 0;
                  const totalStock = (p.variants ?? []).reduce(
                    (sum, v) => sum + (v.stock ?? 0),
                    0
                  );
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.productName}</td>
                      <td className="px-4 py-3">{p.basePrice}</td>
                      <td className="px-4 py-3">{totalVariants}</td>
                      <td className="px-4 py-3">{totalStock}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => router.push(`/products/${p.id}`)}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => router.push(`/products/${p.id}/edit`)}
                            className="rounded-md bg-[#533AB7] px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
                          >
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

