/**
 * Ambient background "glow orb" — same visual effect as a big blurred
 * circle, but built with radial-gradient instead of CSS `blur()`.
 * blur() / backdrop-blur is very expensive on Safari/WebKit mobile;
 * radial-gradient gives a near-identical soft glow for almost no cost.
 *
 * Drop-in replacement for divs like:
 *   <div className="absolute top-10 left-0 w-96 h-96 bg-blue-500/[0.08] rounded-full blur-[120px]" />
 *
 * Usage:
 *   <GlowOrb color="59,130,246" opacity={0.08} size={384} className="top-10 left-0" />
 *
 * - color: an "R,G,B" string (e.g. "59,130,246" for blue-500, "34,211,238" for cyan-400)
 * - opacity: peak opacity at the center of the glow (matches your old bg-color/[x] value)
 * - size: width & height in px (matches your old w-96/h-96 etc. — 96 = 384px, 112 = 448px)
 * - className: positioning classes only (top-10 left-0, bottom-0 right-0, etc.)
 */
export default function GlowOrb({ color = "59,130,246", opacity = 0.08, size = 384, className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, rgba(${color},0) 70%)`,
      }}
    />
  );
}