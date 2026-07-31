'use client';

import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <div className="print:hidden">
  <Header />
</div>

        <main className="min-h-screen bg-slate-100 p-6 print:min-h-0 print:bg-white print:p-0">
  {children}
</main>
      </div>
    </div>
  );
}