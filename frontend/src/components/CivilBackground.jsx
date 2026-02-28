export default function CivilBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050816]">

      {/* Dark Depth FIRST */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050816] to-black opacity-50" />

      {/* Blueprint Grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.15,
          backgroundImage: `
            linear-gradient(#38BDF8 1px, transparent 1px),
            linear-gradient(90deg, #38BDF8 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Slab Lines */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.12,
          backgroundImage: `linear-gradient(transparent 96%, rgba(56,189,248,0.7) 100%)`,
          backgroundSize: "100% 120px"
        }}
      />

      {/* AI Glow (NOW VISIBLE) */}
      <div
        className="absolute civil-pulse rounded-full"
        style={{
          top: "50%",
          left: "50%",
          width: "600px",
          height: "600px",
          background: "rgba(79,70,229,0.35)",
          filter: "blur(140px)",
          transform: "translate(-50%, -50%)"
        }}
      />

      {/* Secondary Glow */}
      <div
        className="absolute civil-pulse-slow rounded-full"
        style={{
          top: "30%",
          left: "20%",
          width: "400px",
          height: "400px",
          background: "rgba(56,189,248,0.25)",
          filter: "blur(120px)"
        }}
      />

    </div>
  );
}