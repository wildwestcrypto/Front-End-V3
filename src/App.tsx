import { useState, useEffect, createContext, useContext } from 'react';
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

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
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
      name: 'i18n:product_demo_name',
      desc: 'i18n:product_demo_desc',
      image: 'brownies-landscape.png',
    },
    uuid: '550e8400-e29b-41d4-a716',
    lot: 'BATCH-BRW-2409',
    exp: '2026-03-15',
    updated: '2025-09-25T09:05:00Z',
    origin: 'i18n:origin_mjays_bakery_us',
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
          'https://mempool.space/tx/3f24b283b6b5026cc48e5f9c58d8d396242cd9d748720c06a0f98f7e205dab50',
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
      },
      {
        ts: '2025-01-31T17:17:15Z',
        type: 'Writ & Ledger',
        where: 'Bitcoin Blockchain',
        who: 'Legal Documentation',
        tags: ['Writ & Ledger'],
        status: 'ok',
        blockchainUrl:
          'https://mempool.space/tx/6b89871fd4ac97727fcb4c0fa2f919d9770f4fb1de3f9f152f8b91418c58442f',
      },
      {
        ts: "2025-09-15T10:15:00Z",
        type: 'Final Ledger with Complete Fractionalization',
        where: 'Bitcoin Blockchain',
        who: 'Fractionalization System',
        tags: ['Final Ledger'],
        status: 'warn',
      },
    ],
  },
};

// ============================================================================
// TRANSLATIONS
// ============================================================================

const TRANSLATIONS: Translations = {
  en: {
    tagline: 'Verification & green traceability',
    verified: 'Verified',
    not_verified: 'Not verified',
    product: 'Product',
    lot: 'Lot',
    expiry: 'Expiry',
    updated: 'Updated',
    footprint_estimate: 'Estimated footprint:',
    actions: 'Grow Your Impact',
    share: 'Share',
    rate_product: 'Rate the product',
    thanks_rating: 'Thanks for your rating!',
    identifier: 'Anti Counterfeit Identifier',
    timeline: 'Carbon Offset Timeline',
    carbon_compensation: 'Carbon compensation',
    produced: 'Produced',
    offset: 'Offset',
    net: 'Net',
    coverage: 'CO₂ NEUTRAL',
    methodology: 'Methodology:',
    provider: 'Provider:',
    audited: 'Audited:',
    public_claim: 'View public claim',
    compensated_full: '200% offset',
    show_more: 'More',
    show_less: 'Less',
    carbon_neutral: 'Carbon Neutral',
    carbon_neutral_headline: 'Net 0 CO₂e',
    carbon_neutral_short:
      '2 times the CO₂ emissions produced are fully offset by this purchase, leaving a net positive impact.',
    carbon_neutral_purchase_line:
      'Choosing these brownies helps neutralize the same amount of carbon as charging your phone 30 times',
    carbon_powered_by: 'Powered by The Evergreen Exchange',
    theme_auto: 'Auto',
    theme_light: 'Light',
    theme_dark: 'Dark',
    verification_pill: 'Verified',
    copy_id: 'Copy ID',
    copied_short: 'Copied',
    timeline_no_events: 'No events',
    product_demo_name: "Gourmet Brownies (MJAY's Bakery)",
    product_demo_desc:
      'Artisan brownies made with fair-trade cocoa, organic ingredients, and lots of love. Certified carbon neutral.',
    origin_mjays_bakery_us: "MJAY's Bakery, Portland, Oregon, USA",
    scans_label: 'Scans',
  },
  es: {
    tagline: 'Verificación y trazabilidad verde',
    verified: 'Verificado',
    not_verified: 'No verificado',
    product: 'Producto',
    lot: 'Lote',
    expiry: 'Caducidad',
    updated: 'Actualizado',
    footprint_estimate: 'Huella estimada:',
    actions: 'Acciones',
    share: 'Compartir',
    rate_product: 'Califica el producto',
    thanks_rating: '¡Gracias por tu calificación!',
    identifier: 'Identificador Anti Falsificación',
    timeline: 'Línea de Tiempo de Compensación de Carbono',
    carbon_compensation: 'Compensación de carbono',
    produced: 'Producido',
    offset: 'Compensado',
    net: 'Neto',
    coverage: 'CO₂ NEUTRAL',
    methodology: 'Metodología:',
    provider: 'Proveedor:',
    audited: 'Auditado:',
    public_claim: 'Ver reclamo público',
    compensated_full: '200% compensado',
    show_more: 'Más',
    show_less: 'Menos',
    carbon_neutral: 'Carbono Neutral',
    carbon_neutral_headline: 'Neto 0 CO₂e',
    carbon_neutral_short:
      '2 veces las emisiones de CO₂ producidas son completamente compensadas por esta compra, dejando un impacto neto positivo.',
    carbon_neutral_purchase_line:
      'Elegir estos brownies ayuda a neutralizar la misma cantidad de carbono que cargar tu teléfono 30 veces',
    carbon_powered_by: 'Impulsado por The Evergreen Exchange',
    theme_auto: 'Auto',
    theme_light: 'Claro',
    theme_dark: 'Oscuro',
    verification_pill: 'Verificado',
    copy_id: 'Copiar ID',
    copied_short: 'Copiado',
    timeline_no_events: 'Sin eventos',
    product_demo_name: "Brownies Gourmet (Panadería de MJAY)",
    product_demo_desc:
      'Brownies artesanales hechos con cacao de comercio justo, ingredientes orgánicos y mucho amor. Certificado carbono neutral.',
    origin_mjays_bakery_us: 'Panadería de MJAY, Portland, Oregon, EE.UU.',
    scans_label: 'Escaneos',
  },
  fr: {
    tagline: 'Vérification et traçabilité verte',
    verified: 'Vérifié',
    not_verified: 'Non vérifié',
    product: 'Produit',
    lot: 'Lot',
    expiry: 'Expiration',
    updated: 'Mis à jour',
    footprint_estimate: 'Empreinte estimée:',
    actions: 'Actions',
    share: 'Partager',
    rate_product: 'Évaluer le produit',
    thanks_rating: 'Merci pour votre évaluation!',
    identifier: 'Identifiant Anti-Contrefaçon',
    timeline: 'Chronologie de la Compensation Carbone',
    carbon_compensation: 'Compensation carbone',
    produced: 'Produit',
    offset: 'Compensé',
    net: 'Net',
    coverage: 'CO₂ NEUTRE',
    methodology: 'Méthodologie:',
    provider: 'Fournisseur:',
    audited: 'Audité:',
    public_claim: 'Voir la déclaration publique',
    compensated_full: '200% compensé',
    show_more: 'Plus',
    show_less: 'Moins',
    carbon_neutral: 'Neutre en Carbone',
    carbon_neutral_headline: 'Net 0 CO₂e',
    carbon_neutral_short:
      '2 fois les émissions de CO₂ produites sont entièrement compensées par cet achat, laissant un impact net positif.',
    carbon_neutral_purchase_line:
      'Choisir ces brownies aide à neutraliser la même quantité de carbone que de charger votre téléphone 30 fois',
    carbon_powered_by: 'Propulsé par The Evergreen Exchange',
    theme_auto: 'Auto',
    theme_light: 'Clair',
    theme_dark: 'Sombre',
    verification_pill: 'Vérifié',
    copy_id: 'Copier l\'ID',
    copied_short: 'Copié',
    timeline_no_events: 'Aucun événement',
    product_demo_name: "Brownies Gastronomiques (Boulangerie de MJAY)",
    product_demo_desc:
      'Brownies artisanaux faits avec du cacao équitable, des ingrédients biologiques et beaucoup d\'amour. Certifié neutre en carbone.',
    origin_mjays_bakery_us: 'Boulangerie de MJAY, Portland, Oregon, États-Unis',
    scans_label: 'Scans',
  },
};

// ============================================================================
// LANGUAGE CONTEXT
// ============================================================================

type Language = 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
});

function useLanguage() {
  return useContext(LanguageContext);
}

// ============================================================================
// LANGUAGE SWITCHER
// ============================================================================

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border-2 border-olive-400 dark:border-olive-600 shadow-evergreen hover:shadow-evergreen-lg transition-all"
        >
          <span className="text-xl">{currentLang.flag}</span>
          <span className="text-sm font-semibold text-evergreen-700 dark:text-cream-200">
            {currentLang.code.toUpperCase()}
          </span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-white dark:bg-slate-800 border-2 border-olive-400 dark:border-olive-600 shadow-evergreen-lg overflow-hidden">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${language === lang.code
                  ? 'bg-olive-100 dark:bg-olive-900/30 text-evergreen-700 dark:text-cream-200'
                  : 'hover:bg-cream-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-semibold">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CARBON GAUGE
// ============================================================================

function CarbonGauge({ produced, offset }: { produced: number; offset: number }) {
  const percentage = offset > 0 ? Math.min((offset / produced) * 100, 200) : 0;
  const displayPercentage = percentage >= 100 ? 100 : percentage;

  return (
    <div className="relative w-48 h-48">
      {/* Outer ring - background */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-olive-200 dark:text-olive-900/40"
        />
        {/* Progress ring */}
        <circle
          cx="96"
          cy="96"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${displayPercentage * 5.53} 553`}
          className="text-money-500 dark:text-money-400 transition-all duration-1000"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-evergreen-700 dark:text-cream-200">
          {displayPercentage.toFixed(0)}%
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-money-600 dark:text-money-400 mt-1">
          CO₂ Neutral
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
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
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
  const [language, setLanguage] = useState<Language>('en');
  const [copiedId, setCopiedId] = useState(false);

  const uuid = '550e8400-e29b-41d4-a716';
  const productData = MOCK_PRODUCTS[uuid];

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || key;
  };

  // Translate text that might contain i18n: prefix
  const translateText = (text: string): string => {
    if (text.startsWith('i18n:')) {
      const key = text.slice(5);
      return t(key);
    }
    return text;
  };

  // Copy ID to clipboard
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(productData.uuid);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
  const net = offset - produced;

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-slate-950">
        {/* Header */}
        <header className="bg-transparent">
          <div className="mx-auto max-w-screen-md px-4 py-3.5 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <TreePine className="w-7 h-7 text-evergreen-700 dark:text-olive-400" />
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-evergreen-700 dark:text-cream-200">
                  The Evergreen Exchange & MJ
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t('tagline')}
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
                {t('identifier')}
              </div>

              <div className="text-sm font-mono break-all text-slate-800 dark:text-slate-200">
                {productData.uuid}
              </div>

              {/* Verification Confirmation Box */}
              <div className="rounded-xl bg-money-50/80 dark:bg-money-900/20 border border-money-500/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{(productData.scanCount || 1) === 1 ? '🎉' : '✅'}</span>
                      <div>
                        <p className="text-sm font-semibold text-money-700 dark:text-money-300">
                          {(productData.scanCount || 1) === 1
                            ? 'Congratulations, carbon claimed!'
                            : `This credit was already verified at ${new Date().toLocaleString()}`
                          }
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {(productData.scanCount || 1) === 1
                            ? new Date().toLocaleString()
                            : `Scanned ${productData.scanCount} times`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border ${(productData.scanCount || 1) === 1
                    ? 'bg-white/60 dark:bg-slate-800/60 border-money-500/20'
                    : 'bg-gold-50/60 dark:bg-gold-900/20 border-gold-500/30'
                    }`}>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${(productData.scanCount || 1) === 1
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-gold-700 dark:text-gold-300'
                      }`}>
                      Scans
                    </div>
                    <div className={`text-2xl font-bold ${(productData.scanCount || 1) === 1
                      ? 'text-money-600 dark:text-money-400'
                      : 'text-gold-600 dark:text-gold-400'
                      }`}>
                      {productData.scanCount || 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="rounded-3xl border border-olive-400/20 dark:border-olive-600/20 bg-white/90 dark:bg-white/5 backdrop-blur p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('actions')}
              </h3>

              {/* Unlock Bonus Impact Button */}
              <div className="space-y-2 relative">
                <button className="relative w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-white font-bold flex items-center justify-center gap-2 shadow-evergreen-xl hover:shadow-2xl transition-all hover:scale-105 pulse-three">
                  <span className="text-xl">⭐</span>
                  <span className="text-base">Unlock Bonus Impact</span>
                </button>

                <p className="relative text-xs text-center text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Get free bonus impact when you create an account. Follow your progress and earn more.
                </p>
              </div>

              {/* Share Button */}
              <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-money-500 to-money-600 dark:from-money-600 dark:to-money-700 text-white font-semibold flex items-center justify-center gap-2 shadow-evergreen hover:shadow-evergreen-lg transition-all">
                <Share2 className="w-4 h-4" />
                {t('share')}
              </button>
            </div>
          </div>

          {/* Carbon Compensation */}
          <div className="rounded-3xl border border-olive-400/50 dark:border-olive-600/30 bg-gradient-to-br from-white via-olive-50/60 to-cream-100 dark:from-slate-900 dark:via-evergreen-900/15 dark:to-slate-900 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-evergreen-700 dark:text-olive-300">
                {t('carbon_compensation')}
              </h2>
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold bg-money-600 dark:bg-money-500 text-white">
                {t('compensated_full')}
              </span>
            </div>

            <div className="flex justify-center">
              <CarbonGauge produced={produced} offset={offset} />
            </div>

            <div className="rounded-xl ring-1 ring-money-500/30 dark:ring-money-400/30 bg-money-50/85 dark:bg-money-900/25 px-6 py-4 space-y-2">
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {t('carbon_neutral_short')}
              </p>
              <p className="text-xs leading-snug font-semibold text-money-700 dark:text-money-300 flex items-start gap-1">
                <span className="w-1.5 h-1.5 mt-1 rounded-full bg-money-500 animate-pulse" />
                <span>{t('carbon_neutral_purchase_line')}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex flex-col px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 min-w-[70px]">
                <span className="uppercase tracking-wide font-medium opacity-70">
                  {t('produced')}
                </span>
                <span className="text-sm font-semibold">{produced}g</span>
              </div>
              <div className="flex flex-col px-3 py-2 rounded-lg border border-money-400/40 dark:border-money-500/40 bg-money-50 dark:bg-money-500/10 min-w-[70px]">
                <span className="uppercase tracking-wide font-medium opacity-70 text-money-700 dark:text-money-300">
                  {t('offset')}
                </span>
                <span className="text-sm font-semibold text-money-700 dark:text-money-300">
                  {offset}g
                </span>
              </div>
              <div className="flex flex-col px-3 py-2 rounded-lg border border-money-500/40 bg-money-500 dark:bg-money-600 text-white min-w-[70px]">
                <span className="uppercase tracking-wide font-medium opacity-70">
                  {t('net')}
                </span>
                <span className="text-sm font-semibold">{net}g</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={productData.carbon_claim_ref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-money-500/10 dark:bg-money-400/10 text-xs font-semibold text-money-700 dark:text-money-200 ring-1 ring-money-500/25 hover:bg-money-500/15 transition-colors"
              >
                <TreePine className="w-4 h-4" />
                {t('carbon_powered_by')}
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {t('timeline')}
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
                            {translateText(event.type)}
                          </span>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-auto">
                            {dateStr} {time}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {translateText(event.where)} •{' '}
                          {translateText(event.who)}
                        </div>
                        {event.tags && event.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {event.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-money-500/10 dark:bg-money-400/10 text-money-700 dark:text-money-300 border border-money-500/20"
                              >
                                {translateText(tag)}
                              </span>
                            ))}
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
                {t('timeline_no_events')}
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

        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </LanguageContext.Provider>
  );
}
