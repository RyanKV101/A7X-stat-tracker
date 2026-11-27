export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <p className="text-eyebrow text-gold-400 font-semibold uppercase">For the fans</p>
      <h1 className="text-gold-gradient text-h1 sm:text-display">A7X Stat Tracker</h1>
      <div className="divider-ornament w-48" />
      <p className="text-muted max-w-md">
        Every song, a quiz that tests how well you really know the band, and your own listening
        stats. Coming soon.
      </p>
    </main>
  );
}
