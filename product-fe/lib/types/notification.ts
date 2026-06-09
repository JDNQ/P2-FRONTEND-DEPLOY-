export interface Notification {
  id: number
  type: 'Orders' | 'Promotions' | 'System'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionLabel?: string
}
