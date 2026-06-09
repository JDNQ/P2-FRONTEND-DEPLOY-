import api from './axiosInstance'

export const uploadApi = {
  productImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const { data } = await api.post<any>('/upload/product-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.urls
  },

  variantImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<any>('/upload/variant-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  },

  avatar: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<any>('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data?.url ?? data.url
  },
}
