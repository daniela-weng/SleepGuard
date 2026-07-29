import type { ReactNode } from "react";

export default function PhoneFrame({
  children,
  tabBar,
  floating,
  toolbar,
  width = 402,
  height = 874,
}: {
  children: ReactNode;
  tabBar?: ReactNode;
  floating?: ReactNode;
  toolbar?: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-200 p-6">
      {toolbar}

      <div
        className="relative overflow-hidden rounded-[44px] border-[10px] border-slate-900 bg-white shadow-2xl"
        style={{ width, height }}
      >
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-3 z-20 h-7 w-32 -translate-x-1/2 rounded-full bg-slate-900" />

        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 overflow-y-auto">{children}</div>
          {tabBar}
        </div>

        {floating}
      </div>
    </div>
  );
}
