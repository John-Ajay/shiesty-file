import Link from "next/link";

export function Navigation() {
  return (
    <header className="w-full border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.15em] text-[var(--ink)] hover:text-white transition-colors"
        >
          PROJECT SHIESTY
        </Link>
        <nav className="flex items-center gap-5 text-xs tracking-[0.1em] text-[var(--ink-dim)]">
          <Link href="/file" className="hover:text-[var(--ink)] transition-colors">
            OPERATIVE FILE
          </Link>
          <Link href="/wall" className="hover:text-[var(--ink)] transition-colors">
            SHIESTY WALL
          </Link>
        </nav>
      </div>
    </header>
  );
}
