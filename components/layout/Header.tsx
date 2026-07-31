'use client';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Abdul Sattar Sons POS
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            Admin
          </p>

          <p className="text-xs text-slate-500">
            Abdul Sattar Sons
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}