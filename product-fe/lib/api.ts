import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getProducts() {
  const res = await api.get("/products");
  return res.data;
}

export async function getProductById(id: string) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(data: unknown) {
  const res = await api.post("/products", data);
  return res.data;
}

export async function updateProduct(id: string, data: unknown) {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
}
