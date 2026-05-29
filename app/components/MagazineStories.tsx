import Link from 'next/link';

const stories = {
  hero: {
    category: 'Wellness',
    issue: 'The Body Issue',
    headline: 'The Art of\nBeing Well',
    subline: 'How India\'s most sought-after therapists are rewriting the rules of self-care — one session at a time.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=90',
    href: '/?category=SpaServices',
    readTime: '6 min read',
  },
  feature1: {
    category: 'Aesthetics',
    headline: 'Beauty Is a\nDecision',
    subline: 'The makeup artists transforming bridal India, one face at a time.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85',
    href: '/?category=MakeupArtists',
    readTime: '4 min read',
  },
  feature2: {
    category: 'Interiors',
    headline: 'Spaces That\nSpeak',
    subline: 'Inside the studios of designers who turn empty rooms into lived-in poetry.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85',
    href: '/?category=InteriorDesigner',
    readTime: '5 min read',
  },
  spotlight: [
    {
      category: 'Lens',
      headline: 'Frames That Last Forever',
      image: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80',
      href: '/?category=Photographers',
      tag: 'Photography',
    },
    {
      category: 'Mind',
      headline: 'The Quiet Revolution of Stillness',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
      href: '/?category=Meditation',
      tag: 'Meditation',
    },
    {
      category: 'Momentum',
      headline: 'Train Like You Mean It',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
      href: '/?category=Fitness%26Training',
      tag: 'Fitness',
    },
    {
      category: 'Occasion',
      headline: 'The Night Was Flawless',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
      href: '/?category=EventManagers',
      tag: 'Events',
    },
  ],
};

export default function MagazineStories() {
  return (
    <section className="w-full bg-[#faf9f7] py-16">
      {/* masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-slate-900" />
          <span className="font-playfair text-xs tracking-[0.35em] uppercase text-slate-500 font-semibold">
            The Quench Edit
          </span>
        </div>
        <span className="hidden sm:block text-[11px] tracking-widest uppercase text-slate-400 font-medium">
          Issue 01 &nbsp;·&nbsp; May 2026
        </span>
        <div className="flex items-center gap-4">
          <span className="font-playfair text-xs tracking-[0.35em] uppercase text-slate-500 font-semibold">
            Stories &amp; Features
          </span>
          <div className="h-px w-12 bg-slate-900" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Row 1: hero + two features ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mb-1">

          {/* hero — spans 2 cols */}
          <Link href={stories.hero.href} className="relative lg:col-span-2 group overflow-hidden" style={{ minHeight: '580px' }}>
            <img
              src={stories.hero.image}
              alt={stories.hero.headline}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* top-left tag */}
            <div className="absolute top-6 left-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-medium border border-white/30 px-3 py-1 backdrop-blur-sm">
                {stories.hero.issue}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 p-8 lg:p-10">
              <p className="text-[11px] tracking-[0.3em] uppercase text-brand-300 font-semibold mb-3">
                {stories.hero.category}
              </p>
              <h2 className="font-playfair text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-[1.05] mb-4 whitespace-pre-line">
                {stories.hero.headline}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
                {stories.hero.subline}
              </p>
              <div className="flex items-center gap-3 text-white/50 text-xs tracking-widest uppercase">
                <span>{stories.hero.readTime}</span>
                <span>·</span>
                <span className="group-hover:text-white transition-colors duration-300">Read Feature →</span>
              </div>
            </div>
          </Link>

          {/* right column — two stacked features */}
          <div className="flex flex-col gap-1">
            {[stories.feature1, stories.feature2].map((s) => (
              <Link key={s.headline} href={s.href} className="relative group overflow-hidden flex-1" style={{ minHeight: '288px' }}>
                <img
                  src={s.image}
                  alt={s.headline}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-brand-300 font-semibold mb-2">
                    {s.category}
                  </p>
                  <h3 className="font-playfair text-2xl text-white font-bold leading-tight mb-2 whitespace-pre-line">
                    {s.headline}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
                    {s.subline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── divider ── */}
        <div className="flex items-center gap-6 my-10">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="font-playfair text-[11px] tracking-[0.4em] uppercase text-slate-400 italic">
            Also in this issue
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── Row 2: four spotlight cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {stories.spotlight.map((s, i) => (
            <Link key={i} href={s.href} className="relative group overflow-hidden" style={{ minHeight: '320px' }}>
              <img
                src={s.image}
                alt={s.headline}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* issue number watermark */}
              <div className="absolute top-4 right-4 font-playfair text-white/20 text-4xl font-bold select-none">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="absolute bottom-0 left-0 p-5">
                <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-white/50 border border-white/20 px-2 py-0.5 mb-3">
                  {s.tag}
                </span>
                <h4 className="font-playfair text-lg text-white font-bold leading-snug">
                  {s.headline}
                </h4>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/70 transition-colors duration-300">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── bottom pull-quote strip ── */}
        <div className="mt-1 bg-slate-900 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-playfair text-2xl sm:text-3xl text-white italic text-center sm:text-left leading-snug max-w-xl">
            "Every service on Quench is a story waiting to be experienced."
          </p>
          <Link
            href="/"
            className="flex-shrink-0 text-[11px] tracking-[0.3em] uppercase text-slate-900 bg-white px-8 py-3 font-semibold hover:bg-brand-50 transition-colors duration-200"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
