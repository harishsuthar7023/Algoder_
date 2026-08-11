import React from "react";

/** Generic glass surface used for cards, forms, list rows. */
export const Card = ({ className = "", children, ...props }) => (
  <div
    className={`relative bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden ${className}`}
    {...props}
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    {children}
  </div>
);

/** Small stat tile used on the dashboard overview. */
export const StatCard = ({ label, value, accent = "text-blue-400" }) => (
  <Card className="p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-400/30 hover:-translate-y-0.5">
    <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">{label}</h2>
    <p className={`text-2xl sm:text-3xl font-black tracking-tight ${accent}`}>{value}</p>
  </Card>
);

/** Status pill, e.g. Active / Inactive, Success / Pending. */
export const Badge = ({ tone = "neutral", children }) => {
  const tones = {
    emerald: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-400/25",
    amber: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-400/25",
    rose: "bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-400/25",
    blue: "bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-400/25",
    neutral: "bg-white/5 text-neutral-400 ring-1 ring-inset ring-white/10",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
};

/** Primary / secondary / danger buttons — keeps every page visually identical. */
export const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 shadow-[0_0_16px_rgba(59,130,246,0.3)]",
    secondary: "bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200",
    danger: "bg-rose-500/90 hover:bg-rose-500 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-neutral-300",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const baseInput =
  "w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-blue-400/50 transition-colors";

export const Field = ({ label, hint, className = "", ...props }) => (
  <div className={className}>
    {label && <label className="block mb-1.5 text-sm font-medium text-neutral-300">{label}</label>}
    <input className={baseInput} {...props} />
    {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
  </div>
);

export const TextArea = ({ label, hint, className = "", ...props }) => (
  <div className={className}>
    {label && <label className="block mb-1.5 text-sm font-medium text-neutral-300">{label}</label>}
    <textarea className={baseInput} {...props} />
    {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
  </div>
);

export const Select = ({ label, className = "", children, ...props }) => (
  <div className={className}>
    {label && <label className="block mb-1.5 text-sm font-medium text-neutral-300">{label}</label>}
    <select className={baseInput} {...props}>
      {children}
    </select>
  </div>
);

/**
 * Responsive data table: renders a real <table> on md+ screens and
 * stacked cards on mobile, so nothing overflows off-screen on a phone.
 *
 * columns: [{ key, label, render?(row) }]
 */
export const ResponsiveTable = ({ columns, rows, keyField = "id", emptyLabel = "Nothing here yet." }) => {
  if (!rows || rows.length === 0) {
    return (
      <Card className="p-10 text-center">
        <p className="text-neutral-500 text-sm">{emptyLabel}</p>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <Card className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              {columns.map((col) => (
                <th key={col.key} className="py-3.5 px-5 font-semibold text-neutral-500 text-xs uppercase tracking-wide whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row[keyField] ?? i}
                className="border-b border-white/5 last:border-0 text-neutral-300 hover:bg-white/[0.03] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3.5 px-5 align-top">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-3">
        {rows.map((row, i) => (
          <Card key={row[keyField] ?? i} className="p-4">
            <dl className="space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between gap-3 text-sm">
                  <dt className="text-neutral-500 shrink-0">{col.label}</dt>
                  <dd className="text-neutral-200 text-right break-words">
                    {col.render ? col.render(row) : row[col.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </>
  );
};