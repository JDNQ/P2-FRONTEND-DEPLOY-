export interface Notification {
  id: number
  userId: number
  title: string
  message: string | null
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}
