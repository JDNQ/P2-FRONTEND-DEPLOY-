"use client";

import { useState, useEffect } from "react";

type Locale = "en" | "vi";

const messages = {
  en: {
    nav: {
      overview: "Overview",
      manageUsers: "Manage Users",
      manageShops: "Manage Shops",
      products: "Products",
      myShop: "My Shop",
      logout: "Logout",
      guest: "Guest",
    },
    header: {
      search: "Search products...",
      logout: "Logout",
    },
    admin: {
      greeting: "Good {time}, Admin!",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      currentTimeMessage: "System performance overview and account management.",
      createManager: "Create Manager",
      totalUsers: "Total Users",
      totalShops: "Total Shops",
      totalProducts: "Total Products",
      totalVariants: "Total Variants",
      userList: "User List",
      userListDescription: "Manage existing system users.",
      searchUserPlaceholder: "Search user...",
      noUsers: "No users yet",
      noUsersDescription: "User list will appear here.",
      username: "Username",
      email: "Email",
      role: "Role",
      actions: "Actions",
      delete: "Delete",
      createNewManager: "Create New Manager",
      createManagerDescription: "Fill in details to add a manager account.",
      cancel: "Cancel",
      creating: "Creating...",
      createManagerSuccess: "Manager has been created successfully.",
      createManagerError: "Failed to create manager.",
      loadDataError: "Unable to load data from server.",
      success: "Success",
      error: "Error",
      confirmDeleteUser: "Are you sure you want to delete this user?",
      deleteUserSuccess: "User has been deleted.",
      deleteUserError: "Unable to delete user.",
    },
    login: {
      title: "Sign in",
      subtitle: "Sign in to your account to continue",
      username: "Username",
      password: "Password",
      submit: "SIGN IN",
      loading: "Signing in...",
      noAccount: "Don't have an account?",
      register: "Register",
      noTokenReceived: "No token received from server.",
      noUserInfo: "No user information received from server.",
      loginError: "An error occurred. Please try again.",
      secureAccess: "Secure access. Fast workflow.",
    },
  },
  vi: {
    nav: {
      overview: "Tổng quan",
      manageUsers: "Quản lý Users",
      manageShops: "Quản lý Shops",
      products: "Sản phẩm",
      myShop: "Shop của tôi",
      logout: "Đăng xuất",
      guest: "Khách",
    },
    header: {
      search: "Tìm kiếm sản phẩm...",
      logout: "Đăng xuất",
    },
    admin: {
      greeting: "Chào buổi {time}, Admin!",
      morning: "Sáng",
      afternoon: "Chiều",
      evening: "Tối",
      currentTimeMessage: "Tổng hợp hiệu suất hệ thống và quản lý tài khoản.",
      createManager: "Tạo Manager",
      totalUsers: "Tổng users",
      totalShops: "Tổng shops",
      totalProducts: "Tổng sản phẩm",
      totalVariants: "Tổng variants",
      userList: "Danh sách users",
      userListDescription: "Quản lý người dùng hiện có của hệ thống.",
      searchUserPlaceholder: "Tìm kiếm user...",
      noUsers: "Chưa có user nào",
      noUsersDescription: "Danh sách người dùng sẽ xuất hiện tại đây.",
      username: "Username",
      email: "Email",
      role: "Role",
      actions: "Actions",
      delete: "Xoá",
      createNewManager: "Tạo Manager mới",
      createManagerDescription: "Điền thông tin để thêm tài khoản manager.",
      cancel: "Huỷ",
      creating: "Đang tạo...",
      createManagerSuccess: "Manager mới đã được tạo.",
      createManagerError: "Tạo manager thất bại.",
      loadDataError: "Không thể tải dữ liệu từ server.",
      success: "Thành công",
      error: "Có lỗi xảy ra",
      confirmDeleteUser: "Bạn có chắc chắn muốn xoá user này không?",
      deleteUserSuccess: "User đã được xoá.",
      deleteUserError: "Không thể xoá user.",
    },
    login: {
      title: "Đăng nhập",
      subtitle: "Đăng nhập vào tài khoản của bạn để tiếp tục",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      submit: "ĐĂNG NHẬP",
      loading: "Đang đăng nhập...",
      noAccount: "Chưa có tài khoản?",
      register: "Đăng ký",
      noTokenReceived: "Không nhận được token từ server.",
      noUserInfo: "Không nhận được thông tin user từ server.",
      loginError: "Đã xảy ra lỗi. Vui lòng thử lại.",
      secureAccess: "Truy cập an toàn. Luồng thao tác nhanh.",
    },
  },
};

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("vi");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "en" || stored === "vi") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    setLocaleState(newLocale);
    window.location.reload();
  };

  return { locale, setLocale };
}

export function useTranslations(namespace: keyof typeof messages.en) {
  const { locale } = useLocale();
  const ns = messages[locale][namespace] as Record<string, string>;

  return (key: string, params?: Record<string, string | number>): string => {
    let text = ns[key] ?? key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }

    return text;
  };
}
