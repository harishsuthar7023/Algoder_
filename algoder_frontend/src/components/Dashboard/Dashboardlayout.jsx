import React from "react";
import Sidebar from "./Sidebar";

/**
 * Wrap every dashboard page in this so the nav, background, and content
 * gutters are always identical — no page should build its own shell.
 *
 *   <DashboardLayout title="Products" subtitle="Manage your catalog">
 *     ...page content...
 *   </DashboardLayout>
 */
const DashboardLayout = ({ title, subtitle, actions, children, wide = true }) => {
  return (
    <div className="md:flex min-h-screen bg-neutral-900 relative overflow-hidden">
      {/* Ambient glow orbs — same as rest of the site */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.06] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/[0.05] rounded-full blur-[120px]" />

      <Sidebar />
      <main className="relative flex-1 min-w-0">
        <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"} px-4 sm:px-6 py-6 sm:py-8`}>
          {(title || actions) && (
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6 sm:mb-8">
              <div>
                {title && (
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;