import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from 'react';
import {
  Share2,
  TreePine,
  MapPin,
  QrCode,
  Star,
  Sun,
  Moon,
  CircleCheck,
  CircleX,
  TriangleAlert,
  Clipboard,
} from 'lucide-react';

// ============================================================================
// MOCK DATA (from the original JS bundle)
// ============================================================================

const MOCK_PRODUCTS = {
  '550e8400-e29b-41d4-a716-446655440000': {
    ok: true,
    product: {
      name: 'i18n:product_demo_name',
      desc: 'i18n:product_demo_desc',
      image: 'brownies-landscape.png',
    },
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    lot: 'BATCH-BRW-2409',
    exp: '2026-03-15',
    updated: '2025-09-25T09:05:00Z',
    origin: 'i18n:origin_mjays_bakery_us',
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

const TRANSLATIONS = {
  en: {
    tagline: 'Verification & green traceability',
    verified: 'Verified',
    not_verified: 'Not verified',
    product: 'Product',
    lot: 'Lot',
    expiry: 'Expiry',
    updated: 'Updated',
    footprint_estimate: 'Estimated footprint:',
    actions: 'Actions',
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
      'Gourmet batch of moist triple-chocolate artisanal brownies. Responsibly sourced ingredients.',
    tag_sustainable_cocoa: 'sustainable cocoa origin',
    tag_temp_control: 'temperature control',
    loc_central_workshop: 'Central Workshop',
    team_mjays: "Mjay's Team",
    origin_mjays_bakery_us: "MJAY's Bakery (GA)",
    event_mix_ingredients: 'Ingredients mixing',
    event_bake_batch: 'Batch baking',
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
    rate_product: 'Valora el producto',
    thanks_rating: '¡Gracias! Valoración registrada.',
    identifier: 'Identificador',
    timeline: 'Línea de tiempo',
    carbon_compensation: 'Compensación de carbono',
    produced: 'Producido',
    offset: 'Compensado',
    net: 'Neto',
    coverage: 'CO₂ NEUTRAL',
    methodology: 'Metodología:',
    provider: 'Proveedor:',
    audited: 'Auditado:',
    public_claim: 'Ver claim público',
    compensated_full: '200% compensado',
    show_more: 'Más',
    show_less: 'Menos',
    carbon_neutral: 'Carbono Neutral',
    carbon_neutral_headline: 'Huella Neta 0 CO₂e',
    carbon_neutral_short:
      'Las emisiones de CO₂ producidas se han compensado íntegramente con proyectos certificados, dejando un balance neto de 0 g CO₂.',
    carbon_neutral_purchase_line:
      'Comprando estos brownies ayudas a neutralizar tu huella: el 200% de las emisiones estimadas está compensada.',
    carbon_powered_by: 'Impulsado por The Evergreen Exchange',
    theme_auto: 'Auto',
    theme_light: 'Claro',
    theme_dark: 'Oscuro',
    verification_pill: 'Verificado',
    copy_id: 'Copiar ID',
    copied_short: 'Copiado',
    timeline_no_events: 'Sin eventos',
    product_demo_name: "Brownies Gourmet (MJAY's Bakery)",
    product_demo_desc:
      'Lote gourmet de brownies húmedos de triple chocolate elaborados de forma artesanal. Ingredientes de origen responsable.',
    tag_sustainable_cocoa: 'origen cacao sostenible',
    tag_temp_control: 'temperatura control',
    loc_central_workshop: 'Taller Central',
    team_mjays: "Equipo Mjay's",
    origin_mjays_bakery_us: "MJAY's Bakery (GA)",
    event_mix_ingredients: 'Mezcla de ingredientes',
    event_bake_batch: 'Horneado lote',
  },
};

// ============================================================================
// LANGUAGE CONTEXT
// ============================================================================

const LanguageContext = createContext({
  lang: 'en',
  t: (key) => key,
  setLang: () => {},
});

const useTranslation = () => useContext(LanguageContext);

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'auto';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode) => {
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDark ? 'dark' : 'light');

      const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', handler);
      return () =>
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return [theme, changeTheme];
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateStr) => {
  try {
    return dateStr ? new Date(dateStr).toLocaleString() : '—';
  } catch {
    return dateStr || '—';
  }
};

const translateKey = (key, translations, lang) => {
  if (!key) return '';
  if (key.startsWith('i18n:')) {
    const translationKey = key.slice(5);
    return (
      translations[lang]?.[translationKey] ||
      translations.en?.[translationKey] ||
      translationKey
    );
  }
  return key;
};

// ============================================================================
// COMPONENTS
// ============================================================================

const VerificationBadge = ({ ok }) => {
  const { t } = useTranslation();

  if (ok === true) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-600/30 dark:border-emerald-400/30">
        <CircleCheck className="w-3 h-3" />
        {t('verification_pill')}
      </span>
    );
  } else if (ok === false) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-600/15 text-rose-700 dark:text-rose-300 border border-rose-600/30">
        <CircleX className="w-3 h-3" />
        {t('not_verified')}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-600/30">
      <TriangleAlert className="w-3 h-3" />
      Unknown
    </span>
  );
};

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();

  const themes = [
    {
      value: 'auto',
      icon: (
        <>
          <Sun className="w-4 h-4 mb-[-2px] opacity-80" />
          <Moon className="w-3 h-3 mt-[-1px] opacity-75" />
        </>
      ),
      label: t('theme_auto'),
    },
    {
      value: 'light',
      icon: <Sun className="w-4 h-4" />,
      label: t('theme_light'),
    },
    {
      value: 'dark',
      icon: <Moon className="w-4 h-4" />,
      label: t('theme_dark'),
    },
  ];

  return (
    <div className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-emerald-500/30 shadow-sm">
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            theme === value
              ? 'text-emerald-800 dark:text-emerald-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300'
          }`}
          title={label}
        >
          {theme === value && (
            <span className="absolute inset-0 rounded-full bg-emerald-500/25 dark:bg-emerald-400/25 ring-1 ring-emerald-500/40 dark:ring-emerald-400/40" />
          )}
          <span className="relative">{icon}</span>
        </button>
      ))}
    </div>
  );
};

const LanguageSwitcher = () => {
  const { lang, setLang } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <div className="fixed bottom-14 right-4 z-50">
      <div className="flex items-center gap-1 px-1 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-emerald-500/30 shadow-lg">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`relative px-3 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              lang === code
                ? 'text-emerald-800 dark:text-emerald-100'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            {lang === code && (
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-400/25 ring-1 ring-emerald-500/40" />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const CopyButton = ({ text, label }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 border border-emerald-500/30 transition-colors"
        aria-label={label || t('copy_id')}
      >
        <Clipboard className="w-4 h-4" />
      </button>
      {copied && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-md bg-emerald-600 text-white shadow whitespace-nowrap">
          {t('copied_short')}
        </span>
      )}
    </div>
  );
};

const CarbonGauge = ({ produced, offset, net }) => {
  const { t } = useTranslation();
  const pct =
    produced && offset ? Math.min(100, (offset / produced) * 100) : 100;

  const radius = 100;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * pct) / 100;

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <svg viewBox="0 0 260 260" className="w-full h-full">
        <circle
          cx="130"
          cy="130"
          r={radius}
          stroke="rgba(5,150,105,0.22)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="130"
          cy="130"
          r={radius}
          stroke="#059669"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <circle
          cx="130"
          cy="130"
          r={radius - strokeWidth - 6}
          fill="currentColor"
          className="text-emerald-50 dark:text-black/25 transition-colors"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tracking-tight leading-none text-emerald-700 dark:text-emerald-100">
          {Math.round(pct)}%
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
          {t('coverage')}
        </span>
      </div>
    </div>
  );
};

const RatingStars = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {rating ? t('thanks_rating') : t('rate_product')}
        </span>
        {rating > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border border-emerald-500/30">
            ★ {rating}/5
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = hover !== null ? star <= hover : star <= rating;
          return (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            >
              <Star
                className={`w-5 h-5 ${
                  filled
                    ? 'fill-amber-400/70 stroke-amber-400'
                    : 'stroke-slate-400 dark:stroke-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem('ft_lang') || 'en'
  );
  const [productData, setProductData] = useState(null);

  const t = (key, vars = {}) => {
    let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en?.[key] || key;
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
    return text;
  };

  useEffect(() => {
    localStorage.setItem('ft_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // Simulate loading the first product
    const uuid = Object.keys(MOCK_PRODUCTS)[0];
    setProductData({ ...MOCK_PRODUCTS[uuid], uuid });
  }, []);

  const translateText = (text) => translateKey(text, TRANSLATIONS, lang);

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-400/40 border-t-transparent animate-spin" />
      </div>
    );
  }

  const produced = productData.carbon_produced_g;
  const offset = productData.carbon_offset_g;
  const net = Math.max(0, offset - produced);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-emerald-500/15">
          <div className="mx-auto max-w-screen-md px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg ring-1 ring-emerald-400/30 bg-gradient-to-br from-emerald-500/15 to-emerald-600/20 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
              The Evergreen Exchange
            </h1>
            <div className="ml-auto">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-screen-md px-4 pb-20 pt-6 space-y-6">
          {/* Product Video */}
          <div className="rounded-3xl overflow-hidden ring-1 ring-emerald-500/20 shadow-xl bg-black aspect-video">
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              poster="https://raw.githubusercontent.com/wildwestcrypto/Front-End-Demo/main/public/sara5.png"
            >
              <source
                src="https://raw.githubusercontent.com/wildwestcrypto/Front-End-Demo/main/public/sara5.mp4"
                type="video/mp4"
              />
              <source src="/path-to-your-video.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Product Details Card */}
          <div className="rounded-3xl border border-emerald-500/20 bg-white/90 dark:bg-white/5 backdrop-blur p-7 space-y-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-16 h-16 rounded-xl border-2 border-emerald-500/80 bg-white dark:bg-slate-950 flex items-center justify-center text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                MJ
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold tracking-tight">
                  {translateText(productData.product.name)}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {translateText(productData.product.desc)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex flex-col rounded-xl border border-emerald-200/60 dark:border-emerald-400/10 p-3 bg-white/80 dark:bg-white/5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('lot')}
                </span>
                <span className="text-sm font-semibold">{productData.lot}</span>
              </div>
              <div className="flex flex-col rounded-xl border border-emerald-200/60 dark:border-emerald-400/10 p-3 bg-white/80 dark:bg-white/5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('expiry')}
                </span>
                <span className="text-sm font-semibold">{productData.exp}</span>
              </div>
              <div className="flex flex-col rounded-xl border border-emerald-200/60 dark:border-emerald-400/10 p-3 bg-white/80 dark:bg-white/5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t('updated')}
                </span>
                <span className="text-sm font-semibold">
                  {formatDate(productData.updated).split(',')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
              <MapPin className="w-4 h-4" />
              {translateText(productData.origin)}
            </div>
          </div>

          {/* Actions & ID Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Actions Card */}
            <div className="rounded-3xl border border-emerald-500/20 bg-white/90 dark:bg-white/5 backdrop-blur p-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('actions')}
              </h3>
              <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow hover:shadow-lg transition-shadow">
                <Share2 className="w-4 h-4" />
                {t('share')}
              </button>
              <RatingStars />
            </div>

            {/* ID Card */}
            <div className="rounded-3xl border border-emerald-500/20 bg-white/90 dark:bg-white/5 backdrop-blur p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <QrCode className="w-3 h-3" />
                {t('identifier')}
              </div>
              <div className="text-sm font-mono break-all">
                {productData.uuid}
              </div>
              <div className="flex items-center gap-3">
                <VerificationBadge ok={productData.ok} />
                <CopyButton text={productData.uuid} />
              </div>
            </div>
          </div>

          {/* Carbon Compensation */}
          <div className="rounded-3xl border border-emerald-300/50 dark:border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/60 to-emerald-100/70 dark:from-slate-900 dark:via-emerald-900/15 dark:to-slate-900 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                {t('carbon_compensation')}
              </h2>
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                {t('compensated_full')}
              </span>
            </div>

            <div className="flex justify-center">
              <CarbonGauge produced={produced} offset={offset} net={net} />
            </div>

            <div className="rounded-xl ring-1 ring-emerald-500/30 bg-emerald-50/85 dark:bg-emerald-900/25 px-6 py-4 space-y-2">
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {t('carbon_neutral_short')}
              </p>
              <p className="text-xs leading-snug font-semibold text-emerald-700 dark:text-emerald-300 flex items-start gap-1">
                <span className="w-1.5 h-1.5 mt-1 rounded-full bg-emerald-500 animate-pulse" />
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
              <div className="flex flex-col px-3 py-2 rounded-lg border border-emerald-400/40 bg-emerald-50 dark:bg-emerald-500/10 min-w-[70px]">
                <span className="uppercase tracking-wide font-medium opacity-70 text-emerald-700 dark:text-emerald-300">
                  {t('offset')}
                </span>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {offset}g
                </span>
              </div>
              <div className="flex flex-col px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500 text-white min-w-[70px]">
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
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 text-xs font-semibold text-emerald-700 dark:text-emerald-200 ring-1 ring-emerald-500/25 hover:bg-emerald-500/15 transition-colors"
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
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-transparent" />
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
                    event.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500';

                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className={`mt-1 w-2.5 h-2.5 rounded-full ${statusColor}`}
                      />
                      <div className="flex-1 rounded-lg border border-emerald-500/15 dark:border-emerald-400/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-2">
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
                                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white transition-colors"
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
        <footer className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-t border-emerald-500/10">
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
