import { z } from "zod";

export const variantSchema = z.object({
  variantName: z.string().min(1, "Variant name là bắt buộc"),
  extraPrice: z.coerce.number(),
  stock: z.coerce.number().min(0, "Stock phải lớn hơn hoặc bằng 0"),
});

export const productSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name là bắt buộc")
    .max(100, "Product name không được vượt quá 100 ký tự"),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(0, "Base price phải lớn hơn hoặc bằng 0"),
  shopId: z.coerce.number().optional(),
  variants: z.array(variantSchema).min(1, "Phải có ít nhất 1 variant"),
});

export type ProductFormData = z.infer<typeof productSchema>;
