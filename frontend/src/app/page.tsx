export default function Home() {
  return (
    <main className="min-h-dvh bg-app">
      <div className="container-page flex min-h-dvh flex-col items-center justify-center gap-8 py-24">
        <div className="anim-rise inline-flex items-center gap-2 rounded-pill border border-line bg-surface-2 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-fg-tertiary">
          <span className="size-1.5 rounded-full bg-brand anim-pulse-soft" />
          Phase 0 — Foundation
        </div>

        <h1 className="anim-rise delay-100 text-center font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          What&apos;s <span className="text-gradient-brand">Happening</span>
        </h1>

        <p className="anim-rise delay-200 max-w-xl text-center text-base text-fg-secondary md:text-lg">
          Foundation is live. Phase 1 next.
        </p>

        <div className="anim-rise delay-300 grid grid-cols-5 gap-3 pt-8 sm:gap-4">
          {[
            { name: "brand", className: "bg-brand", text: "text-fg-on-brand" },
            { name: "surface", className: "bg-surface border border-line", text: "text-fg" },
            { name: "surface-2", className: "bg-surface-2", text: "text-fg" },
            { name: "surface-3", className: "bg-surface-3", text: "text-fg" },
            { name: "soft", className: "bg-brand-soft", text: "text-fg" },
          ].map((c) => (
            <div
              key={c.name}
              className={`${c.className} ${c.text} flex h-20 w-16 items-end justify-center rounded-xl p-2 text-[10px] font-medium sm:h-24 sm:w-20`}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
