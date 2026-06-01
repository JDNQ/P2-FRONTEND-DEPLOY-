import axios, { AxiosError, AxiosHeaders } from "axios";

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const matched = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return matched ? decodeURIComponent(matched.split("=")[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  options?: {
    path?: string;
    maxAge?: number;
    expires?: Date;
    domain?: string;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
  },
) {
  if (typeof document === "undefined") return;

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options?.path) parts.push(`path=${options.path}`);
  if (options?.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`);
  if (options?.expires) parts.push(`expires=${options.expires.toUTCString()}`);
  if (options?.domain) parts.push(`domain=${options.domain}`);
  if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options?.secure) parts.push("secure");

  document.cookie = parts.join("; ");
}

export function deleteCookie(
  name: string,
  options?: { path?: string; domain?: string },
) {
  setCookie(name, "", {
    path: options?.path ?? "/",
    maxAge: 0,
    domain: options?.domain,
  });
}

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? "https://p2-backend-1fme.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = AxiosHeaders.from(config.headers ?? {});
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

function extractData<T>(res: { data: T }): T {
  return res.data;
}

export async function login(data: {
  username: string;
  password: string;
  captchaToken?: string;
}) {
  return extractData(await api.post("/auth/login", data));
}

export async function register(data: {
  username: string;
  password: string;
  email?: string;
}) {
  return extractData(await api.post("/auth/register", data));
}

export async function createManager(data: {
  username: string;
  password: string;
  email?: string;
}) {
  return extractData(await api.post("/auth/create-manager", data));
}

export async function getUsers() {
  return extractData(await api.get("/users"));
}

export async function deleteUser(userId: string) {
  return extractData(await api.delete(`/users/${userId}`));
}

export async function getShops() {
  return extractData(await api.get("/shops"));
}

export async function createShop(data: {
  shopName: string;
  description: string;
}) {
  return extractData(await api.post("/shops", data));
}

export async function getMyShops() {
  return extractData(await api.get("/shops/my"));
}

export async function getProducts() {
  return extractData(await api.get("/products"));
}

export async function getProductById(id: string) {
  return extractData(await api.get(`/products/${id}`));
}

export async function createProduct(data: unknown) {
  return extractData(await api.post("/products", data));
}

export async function updateProduct(id: string, data: unknown) {
  return extractData(await api.put(`/products/${id}`, data));
}
