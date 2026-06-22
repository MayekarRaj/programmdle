import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-4 text-center">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--text3)]">404</p>
      <h1 className="font-mono text-2xl font-bold text-[var(--text)]">
        This puzzle doesn&apos;t exist
      </h1>
      <p className="max-w-sm text-sm text-[var(--text2)]">
        That page wandered off the board. Today&apos;s puzzle is always waiting back home.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md border border-[var(--border)] bg-surface2 px-4 py-2 text-sm font-bold text-[var(--text)] transition-colors hover:bg-surface3"
      >
        Back to today&apos;s puzzle
      </Link>
    </main>
  );
}
