export default function AboutStrip() {
  return (
    <section
      id="about"
      className="rounded-2xl bg-primary/5 border border-primary/15 px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <div className="w-12 h-12 shrink-0 rounded-full bg-primary/15 flex items-center justify-center text-2xl">
        🩺
      </div>
      <div>
        <p className="font-display font-bold text-foreground">
          Designed around real pediatric OT practice
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Every worksheet is designed around real clinical goals: visual perception, handwriting, and
          scissor skills. Print a template as-is in seconds, or customize every detail (shapes,
          difficulty, fonts, and more) to fit the child in front of you.
        </p>
      </div>
    </section>
  );
}
