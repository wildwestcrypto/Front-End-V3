import { useState, useEffect } from 'react';
import { Share2, TreePine, QrCode, Sun, Moon } from 'lucide-react';

// Type definitions
interface Product {
  name: string;
  desc: string;
  image: string;
}

interface Event {
  ts: string;
  type: string;
  where: string;
  who: string;
  tags?: string[];
  status: string;
  blockchainUrl?: string;
  documentUrl?: string;
}

interface ProductData {
  ok: boolean;
  product: Product;
  uuid: string;
  lot: string;
  exp: string;
  updated: string;
  origin: string;
  scanCount: number;
  carbon: string;
  carbon_produced_g: number;
  carbon_offset_g: number;
  carbon_method: string;
  carbon_provider: string;
  carbon_audit_ts: string;
  carbon_claim_ref: string;
  compensation_status: string;
  events: Event[];
}



// Add this style tag
const styles = `
  @keyframes pulse-three-times {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.9;
      transform: scale(1.02);
    }
  }

  .pulse-three {
    animation: pulse-three-times 1.5s ease-in-out 3;
  }

  @keyframes glow-three-times {
    0%, 100% { 
      opacity: 0;
    }
    50% { 
      opacity: 0.3;
    }
  }

  .glow-three {
    animation: glow-three-times 1.5s ease-in-out 3;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================================================
// MOCK DATA (from the original JS bundle)
// ============================================================================

const MOCK_PRODUCTS: { [key: string]: ProductData } = {
  '550e8400-e29b-41d4-a716': {
    ok: true,
    product: {
      name: "Gourmet Brownies (MJAY's Bakery)",
      desc: 'Artisan brownies made with fair-trade cocoa, organic ingredients, and lots of love. Certified carbon neutral.',
      image: 'brownies-landscape.png',
    },
    uuid: '550e8400-e29b-41d4-a716',
    lot: 'BATCH-BRW-2409',
    exp: '2026-03-15',
    updated: '2025-09-25T09:05:00Z',
    origin: "MJAY's Bakery, Portland, Oregon, USA",
    scanCount: 1,
    carbon: '200 g CO₂ per box.',
    carbon_produced_g: 200,
    carbon_offset_g: 400,
    carbon_method: 'ISO 14067 + Verified Carbon Standard',
    carbon_provider: 'The Evergreen Exchange',
    carbon_audit_ts: '2025-09-24T14:20:00Z',
    carbon_claim_ref:
      'https://www.theevergreenexchange.com/offsetter-profile-mjays',
    compensation_status: 'full',
    events: [
      {
        ts: '2024-07-28T13:16:16Z',
        type: 'Anchor Constitution',
        where: 'Bitcoin Blockchain',
        who: 'Complete project data',
        tags: ['Anchor Constitution'],
        status: 'ok',
        blockchainUrl:
          'https://www.blockchain.com/explorer/transactions/btc/3f24b283b6b5026cc48e5f9c58d8d396242cd9d748720c06a0f98f7e205dab50',
        documentUrl: 'https://www.evrgn.org/documents/anchor-constitution-example.pdf',
      },
      {
        ts: '2024-07-28T15:00:00Z',
        type: 'Digital artifact',
        where: 'Bitcoin Network',
        who: 'Double Counting Prevention',
        tags: ['Digital Artifact'],
        status: 'ok',
        blockchainUrl:
          'https://ordpool.space/tx/05560ad7dc5bdb0d533a6872d3deb9845c3d081cdb75c248f206bca298b99ebb',
        documentUrl: 'https://ordinals.com/inscription/08eadb01e43bcfc4a2b4bdd1712e5160666ba592ee3f3462f33710744310941di0',
      },
      {
        ts: '2025-01-31T17:17:15Z',
        type: 'Writ & Ledger',
        where: 'Bitcoin Blockchain',
        who: 'Legal Documentation',
        tags: ['Writ & Ledger'],
        status: 'ok',
        blockchainUrl:
          'https://www.blockchain.com/explorer/transactions/btc/6b89871fd4ac97727fcb4c0fa2f919d9770f4fb1de3f9f152f8b91418c58442f',
        documentUrl: 'https://www.evrgn.org/documents/writ-example.pdf',  
      },
      {
        ts: "2025-09-15T10:15:00Z",
        type: 'Final Ledger with Complete Fractionalization',
        where: 'Bitcoin Blockchain',
        who: 'Fractionalization System',
        tags: ['Final Ledger'],
        status: 'ok',
        blockchainUrl:
          'https://www.blockchain.com/explorer/transactions/btc/6b89871fd4ac97727fcb4c0fa2f919d9770f4fb1de3f9f152f8b91418c58442f',
        documentUrl: 'https://www.evrgn.org/documents/allocation-example.pdf',
      },
    ],
  },
};


// ============================================================================
// CARBON GAUGE - Speedometer Visualization
// ============================================================================

function CarbonGauge({ produced, offset }: { produced: number; offset: number }) {
  const percentage = offset > 0 ? Math.round((offset / produced) * 100) : 0;
  const net = offset - produced;
  // Calculate needle rotation (0% = -90deg, 100% = 0deg, 200% = 90deg)
  const needleRotation = -90 + (percentage * 0.9); // 0.9 degrees per percent (180 degrees total)

  return (
    <div className="w-full space-y-4">
      {/* Gauge Container */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-80 h-44">
          <svg viewBox="0 0 200 130" className="w-full h-full">

            {/* Background arc (gray) */}
            <path
              d="M 35 110 A 65 65 0 0 1 165 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              strokeLinecap="round"
              className="text-slate-300 dark:text-slate-700"
            />

            {/* Progress arc - First half (0-100%) dark green to light green */}
            <path
              d="M 35 110 A 65 65 0 0 1 100 45"
              fill="none"
              stroke="url(#greenGradient)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Progress arc - Second half (100-200%) light green to gold */}
            <path
              d="M 100 45 A 65 65 0 0 1 165 110"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-evergreen-700 dark:text-evergreen-600" stopColor="currentColor" />
                <stop offset="100%" className="text-money-400 dark:text-money-300" stopColor="currentColor" />
              </linearGradient>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-money-400 dark:text-money-300" stopColor="currentColor" />
                <stop offset="100%" className="text-gold-500 dark:text-gold-400" stopColor="currentColor" />
              </linearGradient>
            </defs>

            {/* Center % symbol */}
            <text x="100" y="95" textAnchor="middle" className="text-4xl fill-slate-400 dark:fill-slate-500 font-light opacity-30">
              %
            </text>

            {/* Tick marks - all white */}
            {/* 0 mark - left side */}
            <line x1="35" y1="110" x2="25" y2="110" stroke="white" strokeWidth="3" />
            <text x="15" y="113" textAnchor="middle" className="text-sm fill-slate-600 dark:fill-slate-400 font-semibold">0</text>

            {/* 100 mark - top */}
            <line x1="100" y1="45" x2="100" y2="35" stroke="white" strokeWidth="3" />
            <text x="100" y="30" textAnchor="middle" className="text-sm fill-slate-600 dark:fill-slate-400 font-semibold">100</text>

            {/* 200 mark - right side */}
            <line x1="165" y1="110" x2="175" y2="110" stroke="white" strokeWidth="3" />
            <text x="205" y="113" textAnchor="end" className="text-sm fill-slate-600 dark:fill-slate-400 font-semibold">200</text>

            {/* Needle */}
            <g transform={`rotate(${needleRotation} 100 110)`}>
              <line
                x1="100"
                y1="110"
                x2="100"
                y2="65"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-slate-800 dark:text-slate-200"
              />
              {/* Needle base circle */}
              <circle
                cx="100"
                cy="110"
                r="6"
                fill="currentColor"
                className="text-slate-800 dark:text-slate-200"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wide font-medium text-[10px]">Produced</span>
          <span className="text-base font-bold text-slate-700 dark:text-slate-200">{produced}g</span>
        </div>

        <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-money-50 dark:bg-money-500/10 border border-money-400/40 dark:border-money-500/40">
          <span className="text-money-700 dark:text-money-300 uppercase tracking-wide font-medium text-[10px]">Offset</span>
          <span className="text-base font-bold text-money-700 dark:text-money-300">{offset}g</span>
        </div>

        <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-gold-500 dark:bg-gold-600 border border-gold-600 dark:border-gold-700 text-white">
          <span className="uppercase tracking-wide font-medium opacity-90 text-[10px]">Net</span>
          <span className="text-base font-bold">+{net}g</span>
        </div>
      </div>

      {/* CO2 Neutral badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-money-600 dark:bg-money-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          100% CO₂ NEUTRAL
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// THEME TOGGLE
// ============================================================================

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('auto');
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(newTheme);
    }
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['dark', 'light', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return (
      <div className="relative w-5 h-5">
        <Sun className="w-5 h-5 absolute inset-0" />
        <Moon className="w-3 h-3 absolute bottom-0 right-0" />
      </div>
    );
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-white dark:bg-slate-800 border-2 border-olive-400 dark:border-cream-200 text-evergreen-700 dark:text-cream-200 shadow-evergreen hover:shadow-evergreen-lg transition-all"
      title={`Theme: ${theme}`}
    >
      {getIcon()}
    </button>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const uuid = '550e8400-e29b-41d4-a716';
  const productData = MOCK_PRODUCTS[uuid];

  if (!productData || !productData.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-200 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-evergreen-700 dark:text-cream-200">
            Product Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            UUID: {uuid}
          </p>
        </div>
      </div>
    );
  }

  const produced = productData.carbon_produced_g;
  const offset = productData.carbon_offset_g;


  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-transparent">
        <div className="mx-auto max-w-screen-md px-4 py-3.5 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-evergreen-700 dark:text-cream-200">
                MJ Bakery
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The Evergreen Exchange
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-screen-md px-4 py-4 space-y-4">
        {/* Product Video */}
        <div className="rounded-3xl overflow-hidden ring-1 ring-olive-500/20 shadow-evergreen-lg bg-black aspect-video">
          <video
            className="w-full h-full object-cover"
            controls
            playsInline
            poster="https://raw.githubusercontent.com/wildwestcrypto/Front-End-V3/main/public/sarasouth3.jpg"
          >
            <source
              src="https://raw.githubusercontent.com/wildwestcrypto/Front-End-V3/main/public/sarasouth3.mp4"
              type="video/mp4"
            />
            <source src="/path-to-your-video.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Actions & ID Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* ID Card */}
          <div className="rounded-3xl border border-olive-400/20 dark:border-olive-600/20 bg-white/90 dark:bg-white/5 backdrop-blur p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <QrCode className="w-3 h-3" />
              Anti Counterfeit Identifier
            </div>

            <div className="text-sm font-mono break-all text-slate-800 dark:text-slate-200">
              {productData.uuid}
            </div>

            {/* Verification Confirmation Box */}
            <div className={`rounded-xl ${(productData.scanCount || 1) === 1
              ? 'bg-evergreen-700 dark:bg-evergreen-800 border-evergreen-600'
              : 'bg-gold-600 dark:bg-gold-700 border-gold-500'
              } border p-4`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{(productData.scanCount || 1) === 1 ? '🎉' : '✅'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {(productData.scanCount || 1) === 1
                          ? 'Congratulations, carbon claimed!'
                          : `This credit was already verified at ${new Date().toLocaleString()}`
                        }
                      </p>
                      <p className="text-xs text-cream-100 dark:text-cream-200 mt-1">
                        {(productData.scanCount || 1) === 1
                          ? new Date().toLocaleString()
                          : `Scanned ${productData.scanCount} times`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border ${(productData.scanCount || 1) === 1
                  ? 'bg-white dark:bg-cream-100 border-evergreen-600 text-evergreen-700'
                  : 'bg-white dark:bg-cream-100 border-gold-500 text-gold-700'
                  }`}>
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    Scans
                  </div>
                  <div className="text-2xl font-bold">
                    {productData.scanCount || 1}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="rounded-3xl border border-olive-400/20 dark:border-olive-600/20 bg-white/90 dark:bg-white/5 backdrop-blur p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Grow Your Impact
            </h3>

            {/* Unlock Bonus Impact Button */}
            <div className="space-y-2 relative">
              <button className="relative w-full px-4 py-3.5 rounded-xl bg-gold-500 dark:bg-gold-600 hover:bg-gold-600 dark:hover:bg-gold-700 text-white font-bold flex items-center justify-center gap-2 shadow-evergreen-xl hover:shadow-2xl transition-all hover:scale-105 pulse-three">
                <span className="text-xl">⭐</span>
                <span className="text-base">Unlock Bonus Impact</span>
              </button>

              <p className="relative text-xs text-center text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Get free bonus impact when you create an account. Follow your progress and earn more.
              </p>
            </div>

            {/* Share Button */}
            <button className="w-full px-4 py-3 rounded-xl bg-transparent border-2 border-evergreen-700/30 dark:border-evergreen-600/30 hover:bg-evergreen-700/10 dark:hover:bg-evergreen-600/10 text-evergreen-700 dark:text-evergreen-300 font-medium flex items-center justify-center gap-2 transition-all">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Carbon Compensation */}
        <div className="rounded-3xl border border-olive-400/50 dark:border-olive-600/30 bg-gradient-to-br from-white via-olive-50/60 to-cream-100 dark:from-slate-900 dark:via-evergreen-900/15 dark:to-slate-900 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-evergreen-700 dark:text-olive-300">
              Carbon compensation
            </h2>
            <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold bg-evergreen-700 dark:bg-evergreen-800 text-white">
              200% offset
            </span>
          </div>

          <CarbonGauge produced={produced} offset={offset} />

          <div className="rounded-xl ring-1 ring-money-500/30 dark:ring-money-400/30 bg-money-50/85 dark:bg-money-900/25 px-6 py-4 space-y-2">
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              2 times the CO₂ emissions produced are fully offset by this purchase, leaving a net positive impact.
            </p>
            <p className="text-xs leading-snug font-semibold text-money-700 dark:text-money-300 flex items-start gap-1">
              <span className="w-1.5 h-1.5 mt-1 rounded-full bg-money-500 animate-pulse" />
              <span>Choosing these brownies helps neutralize approximately the same amount of carbon required to charge your phone 30 times</span>
            </p>
          </div>

          <div className="pt-1">
            <a
              href={productData.carbon_claim_ref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-money-500/10 dark:bg-money-400/10 text-xs font-semibold text-money-700 dark:text-money-200 ring-1 ring-money-500/25 hover:bg-money-500/15 transition-colors"
            >
              <TreePine className="w-4 h-4" />
              Powered by The Evergreen Exchange
            </a>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Carbon Offset Timeline
            </h2>
            <span className="text-xs font-medium text-slate-500">
              {productData.events?.length || 0}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-olive-400/30 to-transparent" />
          </div>

          {productData.events && productData.events.length > 0 ? (
            <ol className="space-y-2">
              {productData.events.map((event, idx) => {
                const date = new Date(event.ts);
                const time = date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const dateStr = date.toLocaleDateString();
                const statusColor =
                  event.status === 'ok' ? 'bg-money-500 dark:bg-money-400' : 'bg-gold-500 dark:bg-gold-400';

                return (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className={`mt-1 w-2.5 h-2.5 rounded-full ${statusColor}`}
                    />
                    <div className="flex-1 rounded-lg border border-olive-400/15 dark:border-olive-500/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {event.type}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-auto">
                          {dateStr} {time}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {event.where} •{' '}
                        {event.who}
                      </div>
                      {event.documentUrl && (
                        <div className="mt-2">
                          <a
                            href={event.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-700 text-white transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            View Document
                          </a>
                        </div>
                      )}
                      {event.blockchainUrl && (
                        <div className="mt-2">
                          <a
                            href={event.blockchainUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-evergreen-700 hover:bg-evergreen-600 dark:bg-evergreen-600 dark:hover:bg-evergreen-500 text-white transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            View on Blockchain
                          </a>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="text-xs italic text-slate-500 dark:text-slate-400">
              No events
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-950/80 backdrop-blur border-t border-olive-400/10 dark:border-olive-600/10">
        <div className="mx-auto max-w-screen-md px-4 py-3 text-xs flex flex-wrap items-center gap-4 justify-between text-slate-500 dark:text-slate-400">
          <span>© {new Date().getFullYear()} The Evergreen Exchange</span>
        </div>
      </footer>

    </div>
  );
}