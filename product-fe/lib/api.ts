import axios, { AxiosError } from "axios";

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const matched = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return matched ? decodeURIComponent(matched.split("=")[1]) : undefined;
}

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? "https://p2-backend-1fme.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers as any),
        Authorization: `Bearer ${token}`,
      };
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
