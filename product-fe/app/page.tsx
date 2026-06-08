"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api";


type ProductCard = {
  id: string;
  name: string;
  rating: number;
  sold: number;
  discountPercent: number;
  oldPrice: number;
  price: number;
};

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN");
}

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const starIndex = i + 1;
    const isFull = rounded >= starIndex;
    const isHalf = !isFull && rounded + 0.5 >= starIndex;

    return (
      <span key={i} className="relative inline-flex">
        <svg
          viewBox="0 0 24 24"
          className={
            isFull
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : isHalf
                ? "h-4 w-4 text-amber-400"
                : "h-4 w-4 text-amber-300"
          }
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
        {isHalf && (
          <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-amber-400 text-amber-400">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </span>
        )}
      </span>
    );
  });

  return <div className="flex items-center gap-1">{stars}</div>;
}

function Icon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {children}
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { username?: string; role?: string } | null;
      // compute once, then set
      const nextUser = parsed?.username && parsed?.role ? { username: parsed.username, role: parsed.role } : null;
      if (nextUser) {
        // eslint-disable-next-line react/no-set-state
        setCurrentUser(nextUser);
      }


    } catch {
      // ignore
    }
  }, []);



  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    setCurrentUser(null);
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    window.location.href = "/";
  };

  const [flashRemaining, setFlashRemaining] = useState(3 * 60 * 60 + 12 * 60 + 45); // seconds

  const [featuredActive, setFeaturedActive] = useState<string>("Điện thoại");
  const [bannerSlide, setBannerSlide] = useState(0);
  useEffect(() => { const t = setInterval(() => setBannerSlide((i) => (i + 1) % 4), 4000); return () => clearInterval(t); }, []);


  useEffect(() => {
    const t = window.setInterval(() => {
      setFlashRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  const countdown = useMemo(() => {
    const total = flashRemaining;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, [flashRemaining]);

  const trustBadges = [
    { label: "Hàng chính hãng", icon: "✅" },
    { label: "Freeship mọi đơn", icon: "🚚" },
    { label: "Hoàn 200% nếu hàng giả", icon: "🔄" },
    { label: "30 ngày đổi trả", icon: "📦" },
    { label: "Giao nhanh 2h", icon: "⚡" },
    { label: "Giá siêu rẻ", icon: "💰" },
  ];

  const categories = [
    "📱 Điện Thoại - Máy Tính Bảng",
    "💻 Laptop - Máy Vi Tính",
    "📺 Điện Tử - Điện Lạnh",
    "👗 Thời Trang Nữ",
    "👔 Thời Trang Nam",
    "👟 Giày Dép",
    "💄 Làm Đẹp - Sức Khỏe",
    "🏠 Nhà Cửa - Đời Sống",
    "👶 Mẹ & Bé",
    "📚 Sách - VPP - Quà Tặng",
  ];

  const vouchers = [
    { id: "v1", title: "Giảm 50K", sub: "Cho đơn từ 199K", value: "-50.000₫" },
    { id: "v2", title: "Giảm 100K", sub: "Cho đơn từ 399K", value: "-100.000₫" },
    { id: "v3", title: "Giảm 200K", sub: "Cho đơn từ 799K", value: "-200.000₫" },
    { id: "v4", title: "FREESHIP", sub: "Toàn quốc", value: "0₫ ship" },
  ];

  type RealProduct = {
    id: string;
    productName: string;
    basePrice: number;
    sold?: number;
    rating?: number;
    variants?: Array<{ extraPrice?: number }>;
    images?: Array<{ id?: number; url: string; isPrimary?: boolean }>;
  };

  const [realProducts, setRealProducts] = useState<RealProduct[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProducts();
        if (!mounted) return;
        setRealProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch {
        if (!mounted) return;
        setRealProducts([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch cart count
  useEffect(() => {
    const hasCookie = typeof document !== "undefined" && document.cookie.includes("token=");
    if (!hasCookie) return;
    (async () => {
      try {
        const { getCart } = await import("@/lib/api");
        const res = await getCart();
        const cartItems = Array.isArray(res) ? (res as unknown[]) : ((res as Record<string, unknown>)?.items as unknown[] ?? []);
        setCartCount(cartItems.length);
      } catch {
        setCartCount(0);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerSlide((i) => (i + 1) % 4), 4000);
    return () => clearInterval(t);
  }, []);


  const featuredTabs = ["Điện thoại", "Laptop", "Điện tử", "Thời trang", "Gia dụng"];

  const featuredProducts: Record<string, ProductCard[]> = useMemo(
    () => ({
      "Điện thoại": [
        {
          id: "p1",
          name: "iPhone 15 128GB",
          rating: 4.8,
          sold: 420,
          discountPercent: 12,
          oldPrice: 28990000,
          price: 25490000,
        },
        {
          id: "p2",
          name: "Samsung A55 256GB",
          rating: 4.6,
          sold: 305,
          discountPercent: 9,
          oldPrice: 13990000,
          price: 12790000,
        },
        {
          id: "p3",
          name: "Xiaomi Redmi Note 13 Pro",
          rating: 4.5,
          sold: 268,
          discountPercent: 11,
          oldPrice: 6990000,
          price: 6190000,
        },
        {
          id: "p4",
          name: "OPPO Reno10 Pro",
          rating: 4.4,
          sold: 210,
          discountPercent: 8,
          oldPrice: 10990000,
          price: 10190000,
        },
        {
          id: "p5",
          name: "Realme 12 Pro+",
          rating: 4.3,
          sold: 186,
          discountPercent: 7,
          oldPrice: 11990000,
          price: 11190000,
        },
        {
          id: "p6",
          name: "Vivo V30",
          rating: 4.6,
          sold: 159,
          discountPercent: 10,
          oldPrice: 12990000,
          price: 11690000,
        },
      ],
      "Laptop": [
        {
          id: "p7",
          name: "MacBook Air M3 13",
          rating: 4.9,
          sold: 188,
          discountPercent: 14,
          oldPrice: 34990000,
          price: 29990000,
        },
        {
          id: "p8",
          name: "Dell XPS 13",
          rating: 4.7,
          sold: 140,
          discountPercent: 12,
          oldPrice: 35990000,
          price: 31690000,
        },
        {
          id: "p9",
          name: "ASUS Zenbook 14",
          rating: 4.6,
          sold: 121,
          discountPercent: 11,
          oldPrice: 25990000,
          price: 23190000,
        },
        {
          id: "p10",
          name: "Lenovo ThinkPad E14",
          rating: 4.5,
          sold: 98,
          discountPercent: 9,
          oldPrice: 17990000,
          price: 16290000,
        },
        {
          id: "p11",
          name: "HP Pavilion 15",
          rating: 4.4,
          sold: 85,
          discountPercent: 8,
          oldPrice: 15990000,
          price: 14790000,
        },
        {
          id: "p12",
          name: "Acer Aspire 5",
          rating: 4.3,
          sold: 73,
          discountPercent: 7,
          oldPrice: 13990000,
          price: 12990000,
        },
      ],
      "Điện tử": [
        {
          id: "p13",
          name: "Tai nghe Bluetooth Pro",
          rating: 4.7,
          sold: 520,
          discountPercent: 20,
          oldPrice: 1890000,
          price: 1510000,
        },
        {
          id: "p14",
          name: "Loa Bluetooth Bass",
          rating: 4.5,
          sold: 310,
          discountPercent: 18,
          oldPrice: 990000,
          price: 810000,
        },
        {
          id: "p15",
          name: "Sạc nhanh 65W",
          rating: 4.6,
          sold: 260,
          discountPercent: 25,
          oldPrice: 690000,
          price: 515000,
        },
        {
          id: "p16",
          name: "Chuột không dây ergonomic",
          rating: 4.4,
          sold: 200,
          discountPercent: 15,
          oldPrice: 490000,
          price: 415000,
        },
        {
          id: "p17",
          name: "Bàn phím cơ Gaming",
          rating: 4.3,
          sold: 178,
          discountPercent: 10,
          oldPrice: 1290000,
          price: 1160000,
        },
        {
          id: "p18",
          name: "Đồng hồ thông minh",
          rating: 4.6,
          sold: 144,
          discountPercent: 17,
          oldPrice: 2990000,
          price: 2480000,
        },
      ],
      "Thời trang": [
        {
          id: "p19",
          name: "Áo thun nam form rộng",
          rating: 4.6,
          sold: 610,
          discountPercent: 30,
          oldPrice: 290000,
          price: 203000,
        },
        {
          id: "p20",
          name: "Quần jeans nam ống suông",
          rating: 4.4,
          sold: 420,
          discountPercent: 22,
          oldPrice: 590000,
          price: 459000,
        },
        {
          id: "p21",
          name: "Áo khoác bomber nữ",
          rating: 4.5,
          sold: 308,
          discountPercent: 18,
          oldPrice: 790000,
          price: 646000,
        },
        {
          id: "p22",
          name: "Đầm xòe công sở",
          rating: 4.3,
          sold: 265,
          discountPercent: 16,
          oldPrice: 990000,
          price: 832000,
        },
        {
          id: "p23",
          name: "Giày thể thao sneaker",
          rating: 4.7,
          sold: 210,
          discountPercent: 19,
          oldPrice: 1690000,
          price: 1369000,
        },
        {
          id: "p24",
          name: "Túi tote da bò",
          rating: 4.2,
          sold: 188,
          discountPercent: 14,
          oldPrice: 1290000,
          price: 1109000,
        },
      ],
      "Gia dụng": [
        {
          id: "p25",
          name: "Nồi chiên không dầu 5.5L",
          rating: 4.7,
          sold: 260,
          discountPercent: 21,
          oldPrice: 2490000,
          price: 1960000,
        },
        {
          id: "p26",
          name: "Bình lọc nước tiện dụng",
          rating: 4.4,
          sold: 180,
          discountPercent: 16,
          oldPrice: 990000,
          price: 830000,
        },
        {
          id: "p27",
          name: "Máy xay sinh tố 2 cối",
          rating: 4.5,
          sold: 152,
          discountPercent: 14,
          oldPrice: 1290000,
          price: 1109000,
        },
        {
          id: "p28",
          name: "Bộ chén dĩa cao cấp",
          rating: 4.3,
          sold: 130,
          discountPercent: 12,
          oldPrice: 690000,
          price: 607000,
        },
        {
          id: "p29",
          name: "Quạt sạc mini",
          rating: 4.2,
          sold: 118,
          discountPercent: 18,
          oldPrice: 390000,
          price: 319000,
        },
        {
          id: "p30",
          name: "Đèn LED bàn học",
          rating: 4.6,
          sold: 106,
          discountPercent: 10,
          oldPrice: 490000,
          price: 441000,
        },
      ],
    }),
    []
  );

  const featured = featuredProducts[featuredActive] || [];

  const brandLogos = [
    { name: "Apple" },
    { name: "Samsung" },
    { name: "Xiaomi" },
    { name: "Asus" },
    { name: "LG" },
    { name: "Nike" },
  ];

  const searchTrends = [
    { label: "iPhone", count: 128900 },
    { label: "MacBook", count: 74200 },
    { label: "Tai nghe", count: 52110 },
    { label: "Laptop gaming", count: 40120 },
    { label: "Nồi chiên", count: 28700 },
    { label: "Giày Nike", count: 19850 },
  ];

  const reviews = [
    {
      id: "r1",
      name: "Minh Anh",
      rating: 5,
      content: "Sản phẩm đúng mô tả, giao nhanh. Giá cũng rất tốt so với các nơi khác.",
      product: "iPhone 15 Pro 256GB",
    },
    {
      id: "r2",
      name: "Trần Quốc Huy",
      rating: 4.5,
      content: "Đổi trả dễ dàng, CSKH phản hồi nhanh. Mình rất hài lòng.",
      product: "Laptop ASUS TUF",
    },
    {
      id: "r3",
      name: "Bảo Ngọc",
      rating: 4.8,
      content: "Chất lượng tốt, đóng gói kỹ. Sẽ tiếp tục mua ở TL Market.",
      product: "Giày thể thao sneaker",
    },
  ];

  const apiBaseLocal = process.env.NEXT_PUBLIC_API_URL ?? "";

  const resolveImageUrl = (p?: { images?: Array<{ url: string; isPrimary?: boolean }> }) => {
    const imgUrl = p?.images?.find((i) => i.isPrimary)?.url ?? p?.images?.[0]?.url;
    if (!imgUrl) return null;
    return imgUrl.startsWith("http") ? imgUrl : apiBaseLocal + imgUrl;
  };

  const getRandomDiscountPercent = (p: RealProduct | null, fallbackIdx: number) => {
    const extra = p?.variants?.[0]?.extraPrice;
    if (extra !== undefined && extra !== null) {
      const v = p?.id ? String(p.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0) : fallbackIdx + 1;
      const min = 10;
      const max = 30;
      const span = max - min;
      return min + (v % (span + 1));
    }
    return 0;
  };

  const SkeletonFlashCard = ({ keyId }: { keyId: string | number }) => (
    <div key={keyId} className="bg-white rounded-xl border hover:shadow-md transition cursor-pointer overflow-hidden animate-pulse">
      <div className="h-40 w-full bg-gray-100" />
      <div className="p-3">
        <div className="h-10 bg-gray-100 rounded w-11/12" />
        <div className="mt-2 h-5 bg-gray-100 rounded w-2/3" />
        <div className="mt-4 h-2 bg-gray-100 rounded w-full" />
      </div>
    </div>
  );

  const FlashCard = ({ p, idx }: { p: RealProduct; idx: number }) => {
    const discountPercent = getRandomDiscountPercent(p, idx);
    const sold = p?.sold ?? 0;
    const progress = Math.min(100, Math.round((sold / 250) * 100));

    return (
      <div className="bg-white rounded-xl border hover:shadow-md transition cursor-pointer overflow-hidden" role="button" tabIndex={0}>
        <div className="relative">
          {(() => {
            const fullUrl = resolveImageUrl(p);
            return fullUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fullUrl} alt={p.productName} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200" />
            );
          })()}

          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs rounded px-1.5 py-0.5 font-bold">
              -{discountPercent}%
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[44px]">{p.productName}</div>
          <div className="mt-1 font-black text-red-600">{formatVND(p.basePrice ?? 0)} ₫</div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 font-semibold">
              <span>Đã bán</span>
              <span>{sold}</span>
            </div>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 font-semibold">
            {sold < 50 ? `Vừa mở bán` : `Đã bán ${sold}`}
          </div>
        </div>
      </div>
    );
  };

  const TopDealCard = ({ p, idx }: { p: RealProduct; idx: number }) => {
    const discountPercent = getRandomDiscountPercent(p, idx);

    return (
      <div className="bg-white rounded-xl border hover:shadow-md transition cursor-pointer overflow-hidden">
        <div className="relative">
          {(() => {
            const fullUrl = resolveImageUrl(p);
            return fullUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fullUrl} alt={p.productName} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200" />
            );
          })()}

          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs rounded px-1.5 py-0.5 font-bold">
              -{discountPercent}%
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[44px]">{p.productName}</div>
          <div className="mt-1 font-black text-red-600">{formatVND(p.basePrice ?? 0)} ₫</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement bar */}
      <div className="bg-green-50 text-center text-sm py-2 text-green-700 font-medium border-b border-green-100">
        Freeship đơn từ 45k, giảm nhiều hơn cùng FREESHIP XTRA 🎁
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50">
        {/* Tầng 2 */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 py-3">
            {/* Logo TL Market */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="TL Market Logo" width={56} height={56} className="object-contain" />
                <div className="flex flex-col leading-tight">
                  <span className="font-black text-xl">
                    <span className="text-[#1e3a6e]">TL </span>
                    <span className="text-[#f97316]">Market</span>
                  </span>
                  <span className="text-gray-500 text-xs font-normal">Thương mại điện tử</span>
                </div>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl flex items-center">
              <div className="flex w-full items-center">
                <input
                  placeholder="Bạn tìm gì hôm nay?"
                  className="w-full border border-gray-200 rounded-full px-5 py-2.5 text-sm outline-none bg-white"
                  defaultValue=""
                />
                <Link
                  href="/products"
                  className="ml-2 bg-[#f97316] text-white rounded-full px-6 py-2.5 font-bold text-sm hover:bg-[#ea580c] transition"
                >
                  Tìm kiếm
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Auth */}
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-[#1e3a6e] text-white flex items-center justify-center text-sm font-bold">
                      {currentUser.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="text-[11px] mt-1 text-gray-600 max-w-[70px] truncate">{currentUser.username}</div>
                  </div>

                  <div className="hidden md:flex">
                    {(currentUser.role === "ADMIN" || currentUser.role === "MANAGER") && (
                      <Link
                        href={currentUser.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/manager"}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="ml-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-[#f97316] px-4 py-2 text-sm font-bold text-white hover:bg-[#ea580c] transition"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile auth quick links */}
              <div className="sm:hidden">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                  >
                    Thoát
                  </button>
                ) : (
                  <Link href="/login" className="rounded-xl bg-[#f97316] px-3 py-2 text-sm font-bold text-white hover:bg-[#ea580c] transition">
                    Đăng nhập
                  </Link>
                )}
              </div>

              {/* Icons */}
              <button type="button" className="hidden sm:flex flex-col items-center text-gray-600">
                <Icon className="text-[#1e3a6e]">🔔</Icon>
                <span className="text-[11px]">Thông báo</span>
              </button>

              <button type="button" className="hidden sm:flex flex-col items-center text-gray-600">
                <Icon className="text-[#1e3a6e]">❤️</Icon>
                <span className="text-[11px]">Yêu thích</span>
              </button>

              <div className="flex flex-col items-center cursor-pointer" onClick={() => router.push("/cart")}>
                <div className="relative">
                  <Icon className="text-[#1e3a6e]">🛒</Icon>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px]">Giỏ hàng</span>
              </div>
            </div>
          </div>

          {/* Tầng 3 */}
          <div className="bg-[#1e3a6e]">
            <div className="flex items-center gap-6 max-w-7xl mx-auto px-4 py-2 text-sm font-medium">
              <Link href="/" className="text-white/90 hover:text-orange-300">Trang chủ</Link>
              <Link href="#flash-sale" className="text-white/90 hover:text-orange-300">Flash Sale</Link>
              <Link href="#voucher" className="text-white/90 hover:text-orange-300">Mã giảm giá</Link>
              <Link href="#official" className="text-white/90 hover:text-orange-300">Hàng chính hãng</Link>
              <Link href="#featured" className="text-white/90 hover:text-orange-300">Bán chạy</Link>
              <Link href="#reviews" className="text-white/90 hover:text-orange-300">Tin tức</Link>
              <Link href="#footer" className="text-white/90 hover:text-orange-300">Hỗ trợ</Link>
            </div>
          </div>
        </div>

        {/* mobile search */}
        <div className="md:hidden bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center">
              <input
                placeholder="Bạn tìm gì hôm nay?"
                className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm outline-none"
                defaultValue=""
              />
              <Link href="/products" className="ml-2 bg-[#f97316] text-white rounded-full px-6 py-2.5 font-bold text-sm">
                Tìm kiếm
              </Link>
            </div>
          </div>
        </div>

        {/* Tầng 1 */}
        <div className="bg-[#f0f8ff] text-center text-sm py-1.5 text-[#1e3a6e] font-medium border-b border-[#d9ebff]">
          🎉 Freeship đơn từ 45k - Giảm nhiều hơn cùng FREESHIP XTRA
        </div>
      </header>

      {/* Main */}
      <main>
        {/* Hero */}
        {/* Hero Section - Đã fix layout dư khoảng trắng */}
        <section className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            {/* Hero Section - FIXED Layout */}
            <section className="bg-gray-50 py-4">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-4 items-stretch">   {/* ← Thêm items-stretch */}

                  {/* Sidebar Danh mục */}
                  <aside className="hidden md:block w-56 shrink-0">
                    <div className="bg-white border rounded-xl shadow-sm h-full flex flex-col">
                      <div className="font-bold px-4 py-3 text-gray-700 border-b">Danh mục</div>
                      <div className="flex-1 overflow-y-auto py-1">
                        {categories.map((c, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer mx-1 rounded-lg transition-colors"
                          >
                            <span className="text-base">{c.split(" ")[0]}</span>
                            <span className="line-clamp-2 flex-1">{c.replace(c.split(" ")[0] + " ", "")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>

                  {/* Banner Area */}
                  <div className="flex-1 relative" style={{ height: "340px" }}>   {/* ← Tăng lên 340px */}
                    <div className="relative w-full h-full">
                      <div className="flex h-full gap-2">

                        {/* Banner lớn bên trái */}
                        <div
                          className="flex-1 relative rounded-2xl overflow-hidden cursor-pointer"
                          onClick={() => router.push("/products")}
                        >
                          {[
                            "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832420/af47a55f-c499-43fa-babb-a8274264bf2f_2_w7yx1e.png",
                            "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832418/af47a55f-c499-43fa-babb-a8274264bf2f_2_-_Copy_s0zszz.png",
                            "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_5_-_Copy_tb9aok.png",
                            "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_8_-_Copy_rrks6a.png",
                          ].map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Banner ${i + 1}`}
                              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                              style={{ opacity: i === bannerSlide ? 1 : 0 }}
                            />
                          ))}
                        </div>

                        {/* 2 Banner nhỏ bên phải */}
                        <div className="w-[280px] flex flex-col gap-2 flex-shrink-0">
                          {[
                            [
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_1_-_Copy_1_rs2a03.png", title: "Tech Festival" },
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_1_ypwnrd.png", title: "Bach Hoa" },
                            ],
                            [
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832417/af47a55f-c499-43fa-babb-a8274264bf2f_3_-_Copy_tkbhrv.png", title: "Summer" },
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832418/af47a55f-c499-43fa-babb-a8274264bf2f_4_-_Copy_mcqjxi.png", title: "Gaming" },
                            ],
                            [
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_6_-_Copy_dceenr.png", title: "Me Be" },
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_7_-_Copy_jkravy.png", title: "School" },
                            ],
                            [
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_9_-_Copy_trbcqg.png", title: "Voucher" },
                              { url: "https://res.cloudinary.com/dy2gieleq/image/upload/q_auto/f_auto/v1780832419/af47a55f-c499-43fa-babb-a8274264bf2f_ympuvm.png", title: "TL Plus" },
                            ],
                          ][bannerSlide].map((sub, idx) => (
                            <div
                              key={idx}
                              className="flex-1 relative rounded-2xl overflow-hidden cursor-pointer"
                              style={{ borderRadius: idx === 0 ? "0 16px 0 0" : "0 0 16px 0" }}
                              onClick={() => router.push("/products")}
                            >
                              <img
                                src={sub.url}
                                alt={sub.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <button
                        type="button"
                        onClick={() => setBannerSlide((i) => (i - 1 + 4) % 4)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center text-2xl shadow-md z-10 transition-all"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerSlide((i) => (i + 1) % 4)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-9 h-9 rounded-full flex items-center justify-center text-2xl shadow-md z-10 transition-all"
                      >
                        ›
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {[0, 1, 2, 3].map((idx) => (
                          <button
                            key={idx}
                            onClick={() => setBannerSlide(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === bannerSlide ? "bg-orange-500 w-8" : "bg-white/70 hover:bg-white"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Trust badges redesigned */}
        <section className="bg-white border-y py-3">
          <div className="flex items-center justify-center gap-8 flex-wrap max-w-7xl mx-auto px-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-base">{b.icon}</span>
                <span className="font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Voucher section */}
        <section id="voucher" className="max-w-7xl mx-auto px-4 py-10 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-[#1e3a6e]">VOUCHER DÀNH CHO BẠN</h2>
            <Link href="/products" className="text-[#f97316] font-bold hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-dashed border-orange-300 p-4 flex items-center gap-4"
              >
                <div className="bg-[#f97316] text-white rounded-xl p-3 flex flex-col items-center justify-center">
                  <div className="text-black bg-transparent font-black text-lg">{v.value}</div>
                  <div className="text-xs font-bold">GIẢM</div>
                </div>
                <div className="border-l border-dashed border-orange-300 h-12" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{v.title}</p>
                  <p className="text-xs text-gray-500">{v.sub}</p>
                </div>
                <Link href="/products" className="bg-[#f97316] text-white text-xs px-3 py-1.5 rounded-full font-bold ml-auto">
                  Lưu ngay
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section id="flash-sale" className="bg-white rounded-2xl shadow-sm max-w-7xl mx-auto px-4 py-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white font-black rounded px-3 py-1">⚡ FLASH SALE</div>
              <div className="flex items-center gap-1">
                {countdown.split(":").map((part, idx) => (
                  <div key={idx} className="bg-[#1e3a6e] text-white rounded px-2 py-1 font-mono text-lg font-black">
                    {part}
                  </div>
                ))}
              </div>
            </div>
            <Link href="/products" className="text-[#f97316] font-bold">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {realProducts?.length
              ? realProducts.slice(0, 6).map((p, idx) => <FlashCard key={p.id} p={p} idx={idx} />)
              : Array.from({ length: 6 }).map((_, i) => <SkeletonFlashCard keyId={i} key={i} />)}
          </div>
        </section>

        {/* Top Deal section mới */}
        <section className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[#ef4444] font-black text-lg">👍 TOP DEAL • SIÊU RẺ</h2>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2">
            {(realProducts?.length ? realProducts.slice(6) : []).concat(realProducts?.length ? [] : []).slice(0, 12).map((p, idx) => (
              <div key={p.id} className="min-w-[220px] flex-1 sm:flex-none">
                <TopDealCard p={p} idx={idx} />
              </div>
            ))}
            {!realProducts?.length && Array.from({ length: 6 }).map((_, i) => <SkeletonFlashCard key={i} keyId={i} />)}
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured" className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-[#1e3a6e]">Sản phẩm nổi bật</h2>
                <p className="text-sm text-gray-500 mt-1">Chọn nhanh theo danh mục bạn quan tâm</p>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {featuredTabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFeaturedActive(t)}
                    className={
                      t === featuredActive
                        ? "px-4 py-2 rounded-2xl bg-[#1e3a6e] text-white font-bold whitespace-nowrap"
                        : "px-4 py-2 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 whitespace-nowrap"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.slice(0, 8).map((p, idx) => {
                const discountPercent = p.discountPercent;
                const topDeal = idx % 3 === 0;
                const showRealImage = featuredActive === "Điện thoại";
                const realP = showRealImage ? realProducts?.[idx] : undefined;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border hover:shadow-md transition cursor-pointer overflow-hidden"
                  >
                    <div className="relative">
                      {showRealImage && realP ? (
                        resolveImageUrl(realP) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveImageUrl(realP) as string} alt={realP.productName} className="h-48 w-full object-cover" />
                        ) : (
                          <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                        )
                      ) : (
                        <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded bg-green-100 text-green-700 text-xs font-bold px-2 py-1">
                          Chính Hãng
                        </span>
                      </div>
                      {topDeal && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center rounded bg-red-100 text-red-600 text-xs font-bold px-2 py-1">
                            TOP DEAL
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium line-clamp-2 min-h-[44px]">{p.name}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <StarRow rating={p.rating} />
                        <span className="text-xs text-gray-500 font-semibold">{p.sold}</span>
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-2">
                        <div>
                          <div className="text-lg font-black text-red-600">{formatVND(p.price)} ₫</div>
                          <div className="text-xs text-gray-500 line-through">{formatVND(p.oldPrice)} ₫</div>
                        </div>
                        <div className="-ml-1">
                          {discountPercent > 0 && (
                            <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-2xl">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="bg-white border border-orange-500 text-orange-500 w-full rounded-lg py-2 text-sm font-medium hover:bg-orange-50 mt-2"
                      >
                        Thêm giỏ hàng
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="bg-white max-w-7xl mx-auto px-4 py-6" style={{ marginTop: 0 }}>
          <h2 className="text-2xl font-black text-[#1e3a6e] mb-3">Thương hiệu nổi bật</h2>
          <div className="flex overflow-x-auto gap-4 pb-2">
            {brandLogos.map((b) => (
              <div key={b.name} className="bg-white rounded-2xl border p-4 flex flex-col items-center gap-2 min-w-[160px]">
                <div className="rounded-xl bg-gray-100 h-20 w-full flex items-center justify-center text-2xl font-black text-[#1e3a6e]">
                  {b.name.slice(0, 1)}
                </div>
                <div className="text-sm font-bold text-gray-900">{b.name}</div>
                <div className="text-xs text-gray-500 text-center">Sản phẩm chất lượng</div>
              </div>
            ))}
          </div>
        </section>

        {/* Official stores */}
        <section id="official" className="max-w-7xl mx-auto px-4 py-10 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-[#1e3a6e]">Gian hàng chính hãng</h2>
            <Link href="/products" className="text-[#f97316] font-bold hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brandLogos.map((b) => (
              <div key={b.name} className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-[#1e3a6e]/10 flex items-center justify-center font-black text-[#1e3a6e]">
                  {b.name.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-sm font-bold text-gray-800">{b.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl bg-[#1e3a6e] text-white font-bold px-8 py-3 hover:bg-[#0f2f63] transition"
            >
              Xem shop
            </Link>
          </div>
        </section>

        {/* Search trends */}
        <section className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
          <h2 className="text-2xl font-black text-[#1e3a6e]">Xu hướng tìm kiếm</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {searchTrends.map((t) => (
              <Link
                key={t.label}
                href="/products"
                className="inline-flex items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-2 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-bold text-gray-800">{t.label}</span>
                <span className="text-xs font-semibold text-gray-500">({t.count.toLocaleString("vi-VN")})</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Customer reviews */}
        <section id="reviews" className="max-w-7xl mx-auto px-4 py-10 bg-white">
          <h2 className="text-3xl font-black text-[#1e3a6e]">Đánh giá khách hàng</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-[#1e3a6e]/10 flex items-center justify-center text-[#1e3a6e] font-black">
                    {r.name
                      .split(" ")
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{r.name}</p>
                    <div className="mt-1">
                      <StarRow rating={r.rating} />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-700 leading-relaxed">{r.content}</p>
                <div className="mt-4 text-xs text-gray-500 font-semibold">Đã mua: {r.product}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer" className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="TL Market" width={56} height={56} className="object-contain" />
                <div>
                  <p className="text-xl font-black text-[#1e3a6e]">TL Market</p>
                  <p className="text-sm text-gray-500">Mua sắm uy tín - Giá tốt mỗi ngày</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                TL Market là nền tảng thương mại điện tử Việt Nam, tập trung vào hàng chính hãng, giao nhanh và CSKH tận tâm.
              </p>
              <div className="mt-6">
                <p className="text-sm font-bold text-gray-800">Thanh toán</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[
                    { name: "Visa", bg: "#1e3a6e" },
                    { name: "Mastercard", bg: "#111827" },
                    { name: "ZaloPay", bg: "#2563eb" },
                    { name: "Napas", bg: "#f97316" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="h-10 rounded-2xl px-4 flex items-center justify-center text-white font-black"
                      style={{ backgroundColor: p.bg }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold text-gray-800">Tải ứng dụng</p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href="/"
                    className="flex-1 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 transition"
                  >
                    App Store
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 transition"
                  >
                    Google Play
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="font-black text-gray-900">Về TL Market</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Tuyển dụng
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Bảo mật thông tin
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-black text-gray-900">Hỗ trợ KH</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Trung tâm trợ giúp
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Hướng dẫn mua hàng
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Chính sách đổi trả
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-black text-gray-900">Thanh toán</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Phương thức thanh toán
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Xu hướng hoàn tiền
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Hóa đơn điện tử
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-black text-gray-900">Kết nối</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Facebook
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      Zalo
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-[#1e3a6e] transition">
                      TikTok
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TL Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}