import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Left margin matches sidebar width (w-64 = 16rem) */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}