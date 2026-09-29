import { useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowUpRight,
  AtSign,
  Blocks,
  BookOpen,
  ChevronRight,
  CircleDot,
  ExternalLink,
  Gamepad2,
  Globe2,
  Layers3,
  Link2,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  WalletCards,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  name: string;
  category: string;
  description: string;
  link: string;
  twitter?: string;
};

// MAINTAINER NOTE: This is the single source of truth for the directory.
// Add or update a project here; the grid and project count update automatically.
export const PROJECTS: Project[] = [
  {
    name: 'Elysium Testnet Faucet',
    category: 'Faucet',
    description: 'Claim free ELYS test tokens every 5 minutes. No approval needed.',
    link: 'https://elysium-testnet-faucet--goodluckigweze.replit.app',
  },
  {
    name: 'Elysium HYPE Faucet',
    category: 'Faucet',
    description: 'Claim free HYPE test tokens directly on the Elysium testnet.',
    link: 'https://elysium.kinetiq.xyz/testnet-faucet',
  },
  {
    name: 'Official Bridge',
    category: 'Bridge / Infrastructure',
    description: 'Official bridge between HyperEVM and Elysium testnet.',
    link: 'https://elysium.kinetiq.xyz/testnet-bridge',
  },
  {
    name: 'Official Explorer',
    category: 'Bridge / Infrastructure',
    description: 'Elysium testnet block explorer.',
    link: 'https://elysium.kinetiq.xyz/testnet-explorer',
  },
  {
    name: 'signal.family',
    category: 'Launchpad',
    description: 'Live token launchpad on Elysium testnet.',
    link: 'https://elysium.signal.family/launches',
  },
  {
    name: 'Hyperflip',
    category: 'Prediction Market',
    description: 'Prediction markets and combo bets on Elysium.',
    link: 'https://hyperflip.xyz/',
  },
  {
    name: 'Chainzy Hub',
    category: 'Launchpad',
    description: 'Launchpad hub with Elysium support.',
    link: 'https://chainzy.io/hyperliquid/hub',
  },
  {
    name: 'Hypedexer RPC',
    category: 'RPC / Node',
    description: 'Free public RPC endpoint for Elysium testnet.',
    link: 'https://elysium-testnet-rpc.hypedexer.com',
  },
  {
    name: 'Elysium vs HyperEVM Benchmark',
    category: 'Tools / Analytics',
    description: 'Open-source performance comparison between Elysium and HyperEVM.',
    link: 'https://github.com/brunoamuniz/elysium-vs-hyperevm',
  },
  {
    name: 'Ascend Launchpad',
    category: 'Other',
    description: 'Upcoming sustainable launchpad for Elysium (Coming Soon).',
    link: 'https://x.com/AscendLaunch',
  },
  {
    name: 'Montra',
    category: 'Other',
    description: 'Community-first project coming soon on Elysium.',
    link: 'https://x.com/MontraXYZ',
  },
  {
    name: 'Hyperion',
    category: 'Game',
    description:
      'An isometric cyberpunk RPG where every Vault run is a real challenge. Defeat the god that guards it, secure the loot, and extract before you lose it all.',
    link: 'https://www.hyperionrpg.xyz/',
    twitter: 'https://x.com/Hyperion_RPG',
  },
  {
    name: 'Atlashl',
    category: 'NFT',
    description: 'Building an NFT marketplace on Elysium.',
    link: 'https://elysium.atlashl.xyz/',
    twitter: 'https://x.com/AtlasHL',
  },
  {
    name: 'Ellytradebot',
    category: 'Tools / Analytics',
    description: 'Telegram trading bot.',
    link: 'https://t.me/ellytrade_bot',
    twitter: 'https://x.com/Ellytradebot',
  },
  {
    name: 'Temporal Finance',
    category: 'DeFi',
    description: 'Hedge perps against liquidation and trade perpified options on any asset.',
    link: 'https://perp-options-rfq-production.up.railway.app',
    twitter: 'https://x.com/temporalfinance?s=11',
  },
  {
    name: 'Frog Flip',
    category: 'Game',
    description: 'A provably fair coin flip on Elysium testnet.',
    link: 'https://frog-flip.vercel.app/',
    twitter: 'https://x.com/KhattaDahi',
  },
];

// The complete filter set is intentionally explicit for quick community maintenance.
const CATEGORIES = [
  'All',
  'Faucet',
  'Launchpad',
  'Bridge / Infrastructure',
  'Prediction Market',
  'DeFi',
  'NFT',
  'Tools / Analytics',
  'RPC / Node',
  'Game',
  'Other',
] as const;

const ICONS = {
  defi: Layers3,
  bridge: Link2,
  launchpad: Store,
  faucet: CircleDot,
  analytics: Globe2,
  prediction: Sparkles,
  game: Gamepad2,
  nft: Blocks,
  other: WalletCards,
} as const;

const accentClasses = {
  teal: 'border-teal-300/20 bg-teal-300/[0.09] text-teal-200',
  gold: 'border-amber-200/20 bg-amber-200/[0.09] text-amber-100',
  sky: 'border-sky-300/20 bg-sky-300/[0.09] text-sky-200',
  rose: 'border-rose-300/20 bg-rose-300/[0.09] text-rose-200',
  lime: 'border-lime-300/20 bg-lime-300/[0.09] text-lime-200',
};

const iconByCategory: Record<string, keyof typeof ICONS> = {
  Faucet: 'faucet',
  Launchpad: 'launchpad',
  'Bridge / Infrastructure': 'bridge',
  'Prediction Market': 'prediction',
  DeFi: 'defi',
  NFT: 'nft',
  'Tools / Analytics': 'analytics',
  'RPC / Node': 'bridge',
  Game: 'game',
  Other: 'other',
};

const accentByCategory: Record<string, keyof typeof accentClasses> = {
  Faucet: 'lime',
  Launchpad: 'gold',
  'Bridge / Infrastructure': 'sky',
  'Prediction Market': 'rose',
  DeFi: 'teal',
  NFT: 'rose',
  'Tools / Analytics': 'sky',
  'RPC / Node': 'teal',
  Game: 'gold',
  Other: 'lime',
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ExternalAnchor({
  href,
  children,
  className,
  ariaLabel,
  testId,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  testId: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </a>
  );
}

function BrandMark() {
  return (
    <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-primary/[0.1] text-primary shadow-[0_0_28px_hsl(177_85%_54%_/_0.12)]">
      <span className="absolute size-16 rounded-full border border-primary/20" />
      <span className="absolute size-8 rounded-full border border-primary/30" />
      <span className="relative font-mono text-[11px] font-medium tracking-[-0.15em]">E*</span>
    </span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = ICONS[iconByCategory[project.category] ?? 'other'];
  const accent = accentClasses[accentByCategory[project.category] ?? 'sky'];
  const projectId = slugify(project.name);
  return (
    <article
      className={`card-shine group relative flex min-h-[292px] animate-rise animate-rise-${Math.min(index + 1, 4)} flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/85 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-[hsl(220_27%_12%)] hover:shadow-[0_20px_55px_hsl(222_31%_3%_/_0.38)]`}
      data-testid={`card-project-${projectId}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className={`flex size-11 items-center justify-center rounded-xl border ${accent}`}>
          <Icon size={20} strokeWidth={1.6} />
        </div>
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary/80">{project.category}</span>
          <span className="h-px w-5 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">Elysium</span>
        </div>
        <h3 className="text-[1.35rem] font-medium tracking-[-0.03em] text-foreground">{project.name}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{project.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <ExternalAnchor
            href={project.link}
            testId={`link-open-${projectId}`}
            ariaLabel={`Open ${project.name}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Open app
            <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </ExternalAnchor>
          {project.twitter && (
            <ExternalAnchor
              href={project.twitter}
              testId={`link-twitter-${projectId}`}
              ariaLabel={`Open ${project.name} on X`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <AtSign size={14} />
              X
            </ExternalAnchor>
          )}
        </div>
      </div>
    </article>
  );
}

function Home() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${project.name} ${project.category} ${project.description}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const resetFilters = () => {
    setActiveCategory('All');
    setQuery('');
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 grid-texture opacity-70" />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="group flex items-center gap-3" data-testid="link-brand-home">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold tracking-[-0.02em] text-foreground">Elysium</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-muted-foreground">Ecosystem hub</p>
          </div>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <a href="#directory" className="text-sm text-muted-foreground transition hover:text-foreground" data-testid="link-directory">
            Directory
          </a>
          <a href="#about" className="text-sm text-muted-foreground transition hover:text-foreground" data-testid="link-about">
            About the hub
          </a>
          <ExternalAnchor
            href="https://forms.gle/ZuhbggFdBBSnDRR59"
            testId="link-submit-nav"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm text-foreground transition hover:border-primary/40 hover:bg-secondary"
          >
            Submit a project <ArrowUpRight size={14} />
          </ExternalAnchor>
        </nav>
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground md:hidden"
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          data-testid="button-mobile-menu"
        >
          {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      {mobileNavOpen && (
        <div className="mx-5 flex flex-col gap-1 rounded-2xl border border-border bg-card p-2 md:hidden" data-testid="menu-mobile">
          <a href="#directory" onClick={() => setMobileNavOpen(false)} className="rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid="link-mobile-directory">
            Directory
          </a>
          <a href="#about" onClick={() => setMobileNavOpen(false)} className="rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid="link-mobile-about">
            About the hub
          </a>
          <ExternalAnchor
            href="https://forms.gle/ZuhbggFdBBSnDRR59"
            testId="link-mobile-submit"
            className="m-1 inline-flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
          >
            Submit a project <ArrowUpRight size={15} />
          </ExternalAnchor>
        </div>
      )}

      <section id="top" className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-28">
        <div className="absolute -right-40 top-8 -z-10 size-[27rem] rounded-full bg-primary/[0.05] blur-3xl" />
        <div className="max-w-4xl">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Elysium Testnet · Community maintained
          </div>
          <h1 className="animate-rise animate-rise-1 mt-7 max-w-4xl text-balance text-[clamp(3.25rem,8vw,7.5rem)] font-semibold leading-[0.91] tracking-[-0.075em] text-foreground">
            Elysium Testnet
            <span className="block text-primary">Ecosystem Hub</span>
          </h1>
          <div className="animate-rise animate-rise-2 mt-8 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
              The reliable starting point for exploring what is being built on Elysium. Curated links, clear categories, no wandering.
            </p>
            <a href="#directory" className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground" data-testid="link-browse-directory">
              Browse directory <ArrowDownRight size={16} className="text-primary transition-transform group-hover:translate-y-1" />
            </a>
          </div>
        </div>

        <div className="animate-rise animate-rise-3 mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          <div className="bg-card/90 p-5 sm:p-6">
            <p className="font-mono text-2xl tracking-[-0.05em] text-foreground">{PROJECTS.length}</p>
            <p className="mt-2 text-xs text-muted-foreground">ecosystem projects</p>
          </div>
          <div className="bg-card/90 p-5 sm:p-6">
            <p className="font-mono text-2xl tracking-[-0.05em] text-foreground">11</p>
            <p className="mt-2 text-xs text-muted-foreground">ways to explore</p>
          </div>
          <div className="col-span-2 bg-card/90 p-5 sm:col-span-1 sm:p-6">
            <p className="flex items-center gap-2 font-mono text-2xl tracking-[-0.05em] text-primary">
              <ShieldCheck size={22} strokeWidth={1.5} /> open
            </p>
            <p className="mt-2 text-xs text-muted-foreground">built for the community</p>
          </div>
        </div>
      </section>

      <section id="directory" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="mb-8 flex flex-col justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">01 / Directory</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.045em] text-foreground sm:text-4xl">The ecosystem, at a glance.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground sm:text-right">Open an app directly, or filter by the kind of thing you want to do.</p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Project categories">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs transition-all duration-200 ${activeCategory === category ? 'border-primary/40 bg-primary text-primary-foreground' : 'border-border bg-secondary/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground'}`}
                data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
          <label className="relative block w-full shrink-0 lg:w-64">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="h-10 w-full rounded-full border border-border bg-secondary/40 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              data-testid="input-search-projects"
            />
          </label>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={slugify(project.name)} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 text-center">
            <Search size={22} className="text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nothing matched that search.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try another word or return to the full directory.</p>
            <button type="button" onClick={resetFilters} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" data-testid="button-reset-filters">
              Reset filters <X size={14} />
            </button>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span data-testid="text-results-count">{visibleProjects.length} of {PROJECTS.length} listed</span>
          {activeCategory !== 'All' && <span>Filtered by {activeCategory}</span>}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,hsl(220_27%_11%),hsl(222_31%_8%))] p-7 sm:p-10 lg:p-14">
          <div className="absolute -right-16 -top-24 size-72 rounded-full border border-primary/10" />
          <div className="absolute -right-4 -top-12 size-48 rounded-full border border-primary/10" />
          <div className="relative max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">02 / Keep it growing</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] sm:text-5xl">Building on Elysium?</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              Tell the community what you are making. Submit your project and help turn this directory into a clearer map of the network.
            </p>
            <ExternalAnchor
              href="https://forms.gle/ZuhbggFdBBSnDRR59"
              testId="link-submit-project"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Submit a project <ArrowUpRight size={16} />
            </ExternalAnchor>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-sm font-semibold">Elysium Ecosystem Hub</p>
              <p className="mt-1 text-xs text-muted-foreground">A community-maintained launch point.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Elysium resources">
            <ExternalAnchor href="https://elysium.kinetiq.xyz/testnet-bridge" testId="link-footer-bridge" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground">
              Bridge <ExternalLink size={12} />
            </ExternalAnchor>
            <ExternalAnchor href="https://elysium.kinetiq.xyz/testnet-explorer" testId="link-footer-explorer" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground">
              Explorer <ExternalLink size={12} />
            </ExternalAnchor>
            <ExternalAnchor href="https://elysium.kinetiq.xyz/docs" testId="link-footer-docs" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground">
              Docs <BookOpen size={12} />
            </ExternalAnchor>
          </nav>
        </div>
        <div className="mx-auto flex max-w-7xl justify-between px-5 pb-7 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 sm:px-8 lg:px-12">
          <span>For the Elysium community</span>
          <span>Testnet / Community</span>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;