export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--line)] mt-auto">
      <div className="max-w-5xl mx-auto px-5 py-6 flex flex-col items-center gap-1 text-center">
        <p className="font-display text-xs tracking-[0.2em] text-[var(--ink-dim)]">
          PROJECT SHIESTY
        </p>
        <p className="text-[10px] tracking-[0.15em] text-[var(--ink-faint)]">
          CLASSIFIED OPERATION
        </p>
        <div className="flex gap-4 mt-2 text-[10px] tracking-[0.15em] text-[var(--ink-faint)]">
          <a
            href="https://x.com/projectshiesty"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--ink-dim)] transition-colors"
          >
            X
          </a>
          <a
            href="#"
            className="hover:text-[var(--ink-dim)] transition-colors"
          >
            DISCORD
          </a>
        </div>
      </div>
    </footer>
  );
}
