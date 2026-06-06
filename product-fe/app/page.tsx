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



  // Read auth info from localStorage for showing user/dashboard actions







  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("user");
    setCurrentUser(null);
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    window.location.href = "/";
  };

  const [flashRemaining, setFlashRemaining] = useState(

    3 * 60 * 60 + 12 * 60 + 45,
  ); // seconds


  const [featuredActive, setFeaturedActive] = useState<string>("Điện thoại");

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
    { label: "Hàng chính hãng", icon: "✓" },
    { label: "Miễn phí giao hàng", icon: "⇄" },
    { label: "Đổi trả dễ dàng", icon: "↻" },
    { label: "Thanh toán an toàn", icon: "🔒" },
    { label: "CSKH 24/7", icon: "☎" },
  ];

  const categories = [
    "Điện thoại",
    "Laptop",
    "Điện tử",
    "Thời trang nam",
    "Thời trang nữ",
    "Giày dép",
    "Làm đẹp",
    "Nhà cửa",
    "Mẹ & Bé",
    "Xem thêm",
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
      content:
        "Sản phẩm đúng mô tả, giao nhanh. Giá cũng rất tốt so với các nơi khác.",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-16 flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="TL Market Logo"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
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
              <div className="flex-1 hidden md:flex items-center justify-center">
                <div className="flex w-full max-w-xl items-center rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <input
                    placeholder="Bạn tìm gì hôm nay?"
                    className="bg-transparent outline-none flex-1 text-sm px-1"
                    defaultValue=""
                  />
                  <Link
                    href="/products"
                    className="ml-2 rounded-xl bg-[#f97316] px-4 py-2 text-sm font-bold text-white hover:bg-[#ea580c] transition"
                  >
                    Tìm kiếm
                  </Link>
                </div>
              </div>

              {/* Icons & Auth */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 text-gray-600">
                  <div className="flex flex-col items-center">
                    <Icon className="text-[#1e3a6e]">🔔</Icon>
                    <span className="text-[11px]">Thông báo</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Icon className="text-[#1e3a6e]">❤️</Icon>
                    <span className="text-[11px]">Yêu thích</span>
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => router.push("/cart")}
                  >
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

                <div className="flex items-center gap-2">
                  {currentUser ? (
                    <>
                      <span className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a6e]">
                        👤 {currentUser.username}
                      </span>
                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/dashboard/admin"
                          className="hidden sm:inline-flex rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-[#1e3a6e] hover:bg-gray-50 transition"
                        >
                          Dashboard
                        </Link>
                      )}
                      {currentUser.role === "MANAGER" && (
                        <Link
                          href="/dashboard/manager"
                          className="hidden sm:inline-flex rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-[#1e3a6e] hover:bg-gray-50 transition"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="hidden sm:inline-flex rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="hidden sm:inline-flex rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-[#1e3a6e] hover:bg-gray-50 transition"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className="hidden sm:inline-flex rounded-xl bg-[#f97316] px-4 py-2 text-sm font-bold text-white hover:bg-[#ea580c] transition"
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                  <Link
                    href="/products"
                    className="sm:hidden rounded-xl bg-[#1e3a6e] px-3 py-2 text-sm font-bold text-white"
                  >
                    Mua ngay
                  </Link>
                </div>

              </div>
            </div>

            {/* mobile search */}
            <div className="md:hidden pb-3">
              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                <input
                  placeholder="Bạn tìm gì hôm nay?"
                  className="bg-transparent outline-none flex-1 text-sm px-1"
                  defaultValue=""
                />
                <Link
                  href="/products"
                  className="ml-2 rounded-xl bg-[#f97316] px-4 py-2 text-sm font-bold text-white hover:bg-[#ea580c] transition"
                >
                  Tìm kiếm
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Nav bar 2 */}
        <div className="bg-[#1e3a6e]">
          <div className="max-w-6xl mx-auto px-4">
            <nav className="h-12 flex items-center gap-6 overflow-x-auto">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Flash Sale", href: "#flash-sale" },
                { label: "Mã giảm giá", href: "#voucher" },
                { label: "Hàng chính hãng", href: "#official" },
                { label: "Bán chạy", href: "#featured" },
                { label: "Tin tức", href: "#reviews" },
                { label: "Hỗ trợ", href: "#footer" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-white/90 hover:text-white whitespace-nowrap text-sm font-semibold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main>
        {/* Banner chính */}
        <section className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8">
              <div className="h-52 md:h-64 rounded-3xl overflow-hidden bg-[#1e3a6e] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b2a66] to-[#0f3b8e]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.35),transparent_55%)]" />
                <div className="relative h-full flex items-center">
                  <div className="p-6 sm:p-8">
                    <p className="text-yellow-200 font-extrabold tracking-wide text-sm">SIÊU SALE GIỮA THÁNG</p>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
                      GIẢM ĐẾN 50%
                    </h2>
                    <div className="mt-4 flex gap-3">
                      <Link
                        href="#flash-sale"
                        className="inline-flex items-center rounded-2xl bg-[#f97316] px-5 py-2 text-white font-bold hover:bg-[#ea580c] transition"
                      >
                        Xem Flash Sale
                      </Link>
                      <Link
                        href="/products"
                        className="inline-flex items-center rounded-2xl border border-white/30 bg-white/10 px-5 py-2 text-white font-bold hover:bg-white/15 transition"
                      >
                        Mua ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
              <div className="h-24 sm:h-28 md:h-auto rounded-3xl overflow-hidden bg-gradient-to-br from-blue-800 to-blue-950">
                <div className="h-full p-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-semibold">Ưu đãi</p>
                    <p className="text-white font-black text-base sm:text-lg">Freeship toàn quốc</p>
                  </div>
                  <div className="text-yellow-200 text-2xl">🚚</div>
                </div>
              </div>
              <div className="h-24 sm:h-28 md:h-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#f97316] to-[#ea580c]">
                <div className="h-full p-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-semibold">Thành viên</p>
                    <p className="text-white font-black text-base sm:text-lg">Voucher thành viên</p>
                  </div>
                  <div className="text-white text-2xl">🎁</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-4 py-3"
              >
                <div className="h-10 w-10 rounded-xl bg-[#1e3a6e]/10 text-[#1e3a6e] flex items-center justify-center font-black">
                  {b.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{b.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category icons */}
        <section className="max-w-6xl mx-auto px-4 py-2">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                href="/products"
                className="group rounded-2xl bg-white border border-gray-100 px-2 py-3 flex flex-col items-center gap-2 hover:shadow-sm transition"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#1e3a6e]/10 flex items-center justify-center text-xl group-hover:bg-[#1e3a6e]/15 transition">
                  {c === "Xem thêm" ? "⋯" : "▢"}
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center line-clamp-2">{c}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Voucher section */}
        <section id="voucher" className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-[#1e3a6e]">VOUCHER DÀNH CHO BẠN</h2>
            <Link href="/products" className="text-[#f97316] font-bold hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vouchers.map((v) => (
              <div key={v.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <p className="text-sm font-semibold text-gray-500">{v.sub}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{v.title}</h3>
                      <p className="text-[#f97316] font-black text-2xl mt-1">{v.value}</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-[#f97316]/15 flex items-center justify-center text-2xl">
                      🎫
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <Link
                    href="/products"
                    className="w-full inline-flex items-center justify-center rounded-2xl bg-[#f97316] text-white font-bold py-2 hover:bg-[#ea580c] transition"
                  >
                    Lưu ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section id="flash-sale" className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-[#1e3a6e]">⚡ FLASH SALE</h2>
                <p className="text-sm text-gray-500">
                  Kết thúc lúc{" "}
                  <span className="font-semibold text-gray-700">
                    {countdown}
                  </span>
                </p>

              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 font-semibold">Thời gian còn lại:</div>
                <div className="px-4 py-2 rounded-2xl bg-[#1e3a6e] text-white font-black tracking-widest">
                  {countdown}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {realProducts.slice(0, 4).map((p, idx) => {
                const discountPercent = (() => {
                  const extra = p?.variants?.[0]?.extraPrice;
                  if (extra !== undefined && extra !== null) {
                    const v = p?.id ? String(p.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0) : idx + 1;
                    const min = 10;
                    const max = 30;
                    const span = max - min;
                    return min + (v % (span + 1));
                  }
                  return 0;
                })();

                const progress = Math.min(100, Math.round(((p?.sold ?? 0) / 250) * 100));
                const oldPrice = p?.basePrice ?? 0;
                const price = p?.basePrice ?? 0;

                return (
                  <div key={p.id} className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden">
                    <div className="relative">
                      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300" />
                      {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          -{discountPercent}%
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                        {idx % 2 === 0 ? "HOT" : "DEAL"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2">{p.productName}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-2xl font-black text-red-600">{formatVND(price)} ₫</span>
                      </div>
                      {oldPrice ? (
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="line-through">{formatVND(oldPrice)} ₫</span>
                        </div>
                      ) : null}

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 font-semibold">
                          <span>Đã bán</span>
                          <span>{p?.sold ?? 0}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 mt-2 overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link
                          href={`/products/${p.id}`}
                          className="w-full inline-flex items-center justify-center rounded-2xl bg-[#1e3a6e] text-white font-bold py-2 hover:bg-[#0f2f63] transition"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Featured products */}
        <section id="featured" className="max-w-6xl mx-auto px-4 py-10">
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

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {realProducts.slice(0, 8).map((p) => {
              const discountPercent = (() => {
                const extra = p?.variants?.[0]?.extraPrice;
                if (extra !== undefined && extra !== null) {
                  const v = p?.id ? String(p.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0) : 1;
                  const min = 10;
                  const max = 30;
                  const span = max - min;
                  return min + (v % (span + 1));
                }
                return 0;
              })();

              return (
                <div key={p.id} className="rounded-3xl bg-white border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-300" />
                    <button
                      className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white transition"
                      aria-label="Yêu thích"
                      type="button"
                    >
                      ♡
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px]">{p.productName}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <StarRow rating={p?.rating ?? 4.5} />
                      <span className="text-xs text-gray-500 font-semibold">{(p?.rating ?? 4.5).toFixed(1)}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 font-semibold">Đã bán: {p?.sold ?? 0}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-black text-red-600">{formatVND(p.basePrice ?? 0)} ₫</p>
                        <p className="text-xs text-gray-500 line-through">{formatVND(p.basePrice ?? 0)} ₫</p>
                      </div>
                      {discountPercent > 0 ? (
                        <div className="text-xs font-bold text-[#f97316] bg-[#f97316]/15 px-2 py-1 rounded-2xl">
                          -{discountPercent}%
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/products/${p.id}`}
                        className="w-full inline-flex items-center justify-center rounded-2xl bg-[#f97316] text-white font-bold py-2 hover:bg-[#ea580c] transition"
                      >
                        Thêm giỏ hàng
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          <div className="mt-6 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-[#1e3a6e] font-bold hover:underline">
              Xem thêm
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Official stores */}
        <section id="official" className="max-w-6xl mx-auto px-4 py-10">
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
        <section className="max-w-6xl mx-auto px-4 py-8">
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
        <section id="reviews" className="max-w-6xl mx-auto px-4 py-10">
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
                <Image
                  src="/logo.png"
                  alt="TL Market"
                  width={56}
                  height={56}
                  className="object-contain"
                />
                <div>
                  <p className="text-xl font-black text-[#1e3a6e]">TL Market</p>
                  <p className="text-sm text-gray-500">Mua sắm uy tín - Giá tốt mỗi ngày</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                TL Market là nền tảng thương mại điện tử Việt Nam, tập trung vào hàng chính hãng, giao nhanh và
                CSKH tận tâm.
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

