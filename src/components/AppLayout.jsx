export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden lg:block w-60">
        <Sidebar />
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
