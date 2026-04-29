import AdminGuard from "@/components/news/AdminGuard"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
