export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page text-on-background font-body antialiased">
      {children}
    </div>
  )
}
