'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-primary-500 text-white mt-12">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent-400 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TL</span>
                            </div>
                            TL Market
                        </h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Nền tảng mua sắm trực tuyến uy tín với hàng triệu sản phẩm chính hãng.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition text-lg">
                                f
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition text-lg">
                                𝕏
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition text-lg">
                                📷
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition text-lg">
                                ▶
                            </a>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-accent-400 transition">
                                    Liên hệ chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-gray-300 hover:text-accent-400 transition">
                                    Theo dõi đơn hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" className="text-gray-300 hover:text-accent-400 transition">
                                    Trợ giúp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="font-bold mb-4">Chính sách</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Điều khoản dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Chính sách hoàn trả
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Bảo vệ người mua
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold mb-4">Công ty</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-accent-400 transition">
                                    Tin tức
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-4">Liên hệ</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>📧 support@tlmarket.vn</li>
                            <li>📞 1900 - 1234</li>
                            <li>📍 Hà Nội, Việt Nam</li>
                            <li>⏰ 08:00 - 22:00 (Thứ 2 - CN)</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-primary-400 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">100%</div>
                            <p className="text-sm text-gray-300">Hàng chính hãng</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">🚚</div>
                            <p className="text-sm text-gray-300">Giao hàng nhanh chóng</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">💰</div>
                            <p className="text-sm text-gray-300">Hoàn tiền 30 ngày</p>
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-300 border-t border-primary-400 pt-6">
                        <p>&copy; 2024 TL Market. Tất cả quyền được bảo lưu.</p>
                        <p className="mt-2">Công ty TNHH TL Market | ĐKKD: 0123456789</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
