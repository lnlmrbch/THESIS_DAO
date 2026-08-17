import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { providers } from "near-api-js";

import Header from "./Header";
import "./landing.css";
import {
  IconArrowRight,
  IconArrowUp,
  IconChart,
  IconClose,
  IconDiscord,
  IconExchange,
  IconExpand,
  IconEye,
  IconHandshake,
  IconMail,
  IconPlus,
  IconRocket,
  IconToken,
  IconTools,
  IconUsers,
  IconVault,
  IconVote,
  IconWallet,
  IconX,
  LogoMark,
} from "./icons";

import { initWalletSelector } from "../../wallet";

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const faqs = [
  {
    q: "Was ist eine DAO?",
    a: "Eine DAO (Decentralized Autonomous Organization) ist eine digitale Organisation, die von ihren Mitgliedern gemeinschaftlich gesteuert wird. Entscheidungen werden transparent und demokratisch getroffen – ohne zentrale Instanz. Alle Transaktionen und Abstimmungen sind auf der Blockchain nachvollziehbar.",
  },
  {
    q: "Wie kann ich mitmachen?",
    a: "Verbinde einfach deine NEAR Wallet, erwerbe THESISDAO Tokens und schon kannst du an Abstimmungen teilnehmen, Proposals erstellen und die Zukunft der DAO mitgestalten. Je mehr Tokens du besitzt, desto mehr Stimmgewicht hast du bei Entscheidungen.",
  },
  {
    q: "Was kostet die Teilnahme?",
    a: "Du benötigst nur NEAR für die Transaktionen auf der Blockchain. Es gibt keine versteckten Gebühren oder Mitgliedsbeiträge. Die Kosten für Transaktionen sind minimal und transparent.",
  },
  {
    q: "Wie funktioniert das Voting?",
    a: "Jeder THESISDAO Token gibt dir ein Stimmrecht. Du kannst über verschiedene Proposals abstimmen, die von der Community eingereicht werden. Die Abstimmungen laufen für eine festgelegte Zeit und sind transparent auf der Blockchain einsehbar.",
  },
  {
    q: "Was passiert mit dem Treasury?",
    a: "Das Treasury wird von der Community verwaltet. Alle Mitglieder können Vorschläge einreichen, wie die Mittel verwendet werden sollen – sei es für Entwicklung, Marketing oder andere Community-Projekte. Über die Verwendung wird demokratisch abgestimmt.",
  },
  {
    q: "Wie sicher ist das System?",
    a: "Die DAO basiert auf der NEAR Blockchain, einer der sichersten und skalierbarsten Blockchains. Alle Transaktionen und Abstimmungen sind transparent und unveränderlich. Smart Contracts regeln die Logik und Sicherheit des Systems.",
  },
];

const features = [
  {
    icon: IconVote,
    title: "Mitbestimmen",
    desc: "Stimme über Vorschläge ab und gestalte die Zukunft aktiv mit.",
  },
  {
    icon: IconEye,
    title: "Transparenz",
    desc: "Alle Entscheidungen und Transaktionen sind on-chain und nachvollziehbar.",
  },
  {
    icon: IconToken,
    title: "Token-Belohnungen",
    desc: "Verdiene und nutze DAO-Token für Stimmrechte und Vorteile.",
  },
  {
    icon: IconVault,
    title: "Community Treasury",
    desc: "Gemeinsame Verwaltung und Nutzung der Mittel durch die Community.",
  },
];

const allocations = [
  {
    icon: IconExchange,
    title: "Umlauf",
    desc: "60% Community-basiert",
    value: 60,
    tone: "mint",
  },
  {
    icon: IconTools,
    title: "Treasury",
    desc: "30% für Entwicklung & Finanzierung",
    value: 30,
    tone: "iris",
  },
  {
    icon: IconUsers,
    title: "Team",
    desc: "10% für Core-Contributors",
    value: 10,
    tone: "chalk",
  },
];

const milestones = [
  { q: "Q3 2025", title: "DAO & Website Launch", icon: IconRocket, done: true },
  { q: "Q4 2025", title: "Protocol Improvements", icon: IconUsers },
  { q: "Q1 2026", title: "Token Unlock & Distribution", icon: IconToken },
  { q: "Q2 2026", title: "Strategic Partnerships", icon: IconHandshake },
  { q: "Q3 2026", title: "Ecosystem Expansion", icon: IconChart },
];

const shots = [
  {
    src: "screenshot_dashboard.png",
    alt: "Dashboard Übersicht",
    caption: "Dashboard: Token, Voting Power & Proposals",
  },
  {
    src: "screenshot_proposal.png",
    alt: "Proposals im Dashboard",
    caption: "Proposals & Abstimmungen auf einen Blick",
  },
  {
    src: "screenshot_buytokens.png",
    alt: "Token kaufen",
    caption: "Token kaufen & Mitglied werden",
  },
];

const tickerPhrases = [
  "Demokratisch",
  "Transparent",
  "Community Driven",
  "Built on NEAR",
];

const heroPillars = [
  { icon: IconWallet, label: "Wallet" },
  { icon: IconToken, label: "Token" },
  { icon: IconChart, label: "Dashboard" },
  { icon: IconUsers, label: "Community" },
];

const EASE = [0.22, 1, 0.36, 1];
const asset = (file) => `${process.env.PUBLIC_URL}/screenshots/${file}`;

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

/** Scroll reveal — opacity + a short lift only, so it can never shift layout. */
const Reveal = ({ children, delay = 0, y = 18, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

const SectionHeading = ({ index, eyebrow, title, lead, align = "left" }) => (
  <div className={align === "center" ? "text-center" : ""}>
    <Reveal>
      <div
        className={`flex items-center gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="lp-mono text-[0.6875rem] text-mint">{index}</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="lp-eyebrow">{eyebrow}</span>
      </div>
    </Reveal>
    <Reveal delay={0.06}>
      <h2 className="lp-display mt-6 text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] text-white">
        {title}
      </h2>
    </Reveal>
    {lead && (
      <Reveal delay={0.12}>
        <p
          className={`mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-white/55 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      </Reveal>
    )}
  </div>
);

/** Wraps a card so its border spotlight follows the pointer. */
const SpotlightCard = ({ className = "", children, ...rest }) => {
  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div className={`lp-card ${className}`} onMouseMove={onMove} {...rest}>
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const LandingPage = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  });

  const [openFaq, setOpenFaq] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [activeShot, setActiveShot] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const heroRef = useRef(null);

  /* The landing page owns a dark canvas; the app shell is light. */
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#08090A";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { selector } = await initWalletSelector();
        const accounts = selector.store.getState().accounts;
        if (accounts.length > 0) navigate("/dashboard");
      } catch {
        console.log("🧠 Wallet nicht verbunden");
      }
    })();
  }, [navigate]);

  const connectWallet = async () => {
    const { modal } = await initWalletSelector();
    modal.show();
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Pointer spotlight in the hero. */
  useEffect(() => {
    if (reduce) return undefined;
    const el = heroRef.current;
    if (!el) return undefined;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduce]);

  /* Close the lightbox on Escape. */
  useEffect(() => {
    if (!modalImage) return undefined;
    const onKey = (e) => e.key === "Escape" && setModalImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalImage]);

  /* ---- Token sale ------------------------------------------------------- */

  const HARDCAP = 10_000_000;
  const [tokenSale, setTokenSale] = useState({
    sold: null,
    symbol: null,
    decimals: 24,
    loading: true,
    failed: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const contractId = "dao.lioneluser.testnet";
        const provider = new providers.JsonRpcProvider(
          "https://rpc.testnet.near.org"
        );
        const fetchView = async (method, args = {}) => {
          const res = await provider.query({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
            finality: "final",
          });
          if (!res?.result) return null;
          return JSON.parse(new TextDecoder().decode(new Uint8Array(res.result)));
        };

        /* Never leave the panel stuck in its skeleton if the RPC hangs. */
        const withTimeout = (promise, ms = 9000) =>
          Promise.race([
            promise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("RPC timeout")), ms)
            ),
          ]);

        const [meta, totalSupply, tokenPool] = await withTimeout(
          Promise.all([
            fetchView("ft_metadata"),
            fetchView("get_total_supply"),
            fetchView("get_token_pool"),
          ])
        );

        setTokenSale({
          sold: (parseFloat(totalSupply) - parseFloat(tokenPool)).toString(),
          symbol: meta?.symbol || "TOKEN",
          decimals: meta?.decimals ?? 24,
          loading: false,
          failed: false,
        });
      } catch (err) {
        console.error("Fehler beim Laden des Token Sale Stands:", err);
        setTokenSale((prev) => ({ ...prev, loading: false, failed: true }));
      }
    })();
  }, []);

  const soldHuman = tokenSale.sold
    ? parseFloat(tokenSale.sold) / Math.pow(10, tokenSale.decimals)
    : 0;
  const percent = soldHuman ? Math.min(100, (soldHuman / HARDCAP) * 100) : 0;
  const soldLabel = soldHuman.toLocaleString("de-CH", {
    maximumFractionDigits: 0,
  });

  return (
    <div className="lp">
      <Header connectWallet={connectWallet} />

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-mint via-iris to-mint"
      />

      <div className="lp-grain" />

      <main className="relative z-[2]">
        {/* ================================================================== */}
        {/*  Hero                                                              */}
        {/* ================================================================== */}
        <section
          id="hero"
          ref={heroRef}
          className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-6 sm:pt-40 lg:pb-24"
        >
          <div className="lp-grid" />
          <div className="lp-spotlight" />
          <div
            className="lp-aurora lp-drift -left-32 -top-24 h-[440px] w-[440px] opacity-[0.22]"
            style={{ background: "#2DD4BF" }}
          />
          <div
            className="lp-aurora lp-drift-slow -right-24 top-24 h-[380px] w-[380px] opacity-[0.18]"
            style={{ background: "#7C5CFA" }}
          />

          <div className="relative mx-auto grid max-w-content items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* --- Copy --- */}
            <div>
              <Reveal>
                <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
                  </span>
                  <span className="lp-mono text-[0.6875rem] leading-snug text-white/60">
                    Ein Prototyp im Rahmen einer Bachelor Thesis an der ZHAW
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="lp-display mt-7 text-[3.25rem] leading-[0.92] sm:text-[4.5rem] lg:text-[5.25rem]">
                  <span className="lp-sheen">Thesis DAO</span>
                </h1>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55 sm:text-xl">
                  Demokratisch. Transparent. Community Driven. Built on NEAR.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={connectWallet}
                    className="lp-btn lp-btn--primary"
                  >
                    <IconWallet size={17} />
                    Wallet verbinden &amp; starten
                  </button>
                  <ScrollLink
                    to="about"
                    smooth
                    duration={600}
                    offset={-96}
                    tabIndex={0}
                    role="button"
                    className="lp-btn lp-btn--ghost group"
                  >
                    Mehr erfahren
                    <IconArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </ScrollLink>
                </div>
              </Reveal>

              <Reveal delay={0.26}>
                <p className="lp-mono mt-8 text-[0.6875rem] tracking-wider text-white/30">
                  von Lionel Murbach
                </p>
              </Reveal>
            </div>

            {/* --- Token sale panel --- */}
            <Reveal delay={0.18} y={26}>
              <div className="relative">
                <div
                  className="lp-aurora absolute inset-8 opacity-25"
                  style={{ background: "#5EEAD4" }}
                />
                <div className="lp-panel relative p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="lp-eyebrow">Token Sale</span>
                    <span className="lp-mono rounded-md border border-mint/25 bg-mint/10 px-2 py-0.5 text-[0.625rem] text-mint">
                      {tokenSale.symbol || "THESISDAO"}
                    </span>
                  </div>

                  {tokenSale.loading ? (
                    <div className="mt-6 space-y-3">
                      <div className="h-9 w-40 animate-pulse rounded-md bg-white/[0.06]" />
                      <div className="h-1.5 w-full animate-pulse rounded-full bg-white/[0.06]" />
                    </div>
                  ) : (
                    <>
                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="lp-mono text-[2.25rem] leading-none text-white">
                          {tokenSale.failed ? "—" : soldLabel}
                        </span>
                        <span className="lp-mono text-sm text-white/35">
                          / {HARDCAP.toLocaleString("de-CH")}
                        </span>
                      </div>

                      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-mint-deep to-mint"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="lp-mono text-[0.6875rem] text-white/35">
                          {tokenSale.failed
                            ? "Sale-Stand nicht verfügbar"
                            : "verkauft"}
                        </span>
                        <span className="lp-mono text-[0.6875rem] text-mint">
                          {tokenSale.failed ? "" : `${percent.toFixed(2)}%`}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">
                    {heroPillars.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 bg-ink-900 px-3.5 py-3.5"
                      >
                        <Icon size={17} className="shrink-0 text-mint" />
                        <span className="text-[0.8125rem] text-white/70">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --- Ticker ------------------------------------------------------- */}
        <div className="lp-marquee relative overflow-hidden border-y border-white/[0.07] py-4">
          <div className="lp-marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {tickerPhrases.map((phrase, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center">
                    <span className="lp-eyebrow whitespace-nowrap px-7 text-white/40">
                      {phrase}
                    </span>
                    <LogoMark size={13} className="opacity-40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        </div>

        {/* ================================================================== */}
        {/*  About                                                             */}
        {/* ================================================================== */}
        <section
          id="about"
          className="relative scroll-mt-28 px-5 py-20 sm:px-6 lg:py-28"
        >
          <div className="mx-auto max-w-content">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading
                  index="01"
                  eyebrow="Über uns"
                  title="Was ist diese DAO?"
                />
              </div>

              <div className="space-y-6">
                <Reveal>
                  <p className="text-[1.0625rem] leading-[1.75] text-white/70 sm:text-lg">
                    Eine DAO (Decentralized Autonomous Organization) ist eine
                    digitale Organisation, die von ihren Mitgliedern
                    gemeinschaftlich gesteuert wird. Entscheidungen werden
                    transparent und demokratisch getroffen – ohne zentrale
                    Instanz.
                  </p>
                </Reveal>
                <Reveal delay={0.06}>
                  <p className="text-[1.0625rem] leading-[1.75] text-white/70 sm:text-lg">
                    Mit dem Kauf von Tokens wirst du Teil der DAO und erhältst
                    die gleichen Rechte wie ein Aktionär einer traditionellen AG
                    – oder sogar noch mehr: Du kannst mitbestimmen, Vorschläge
                    einbringen und direkt an der Entwicklung und Verwaltung der
                    Organisation teilnehmen.
                  </p>
                </Reveal>
                <Reveal delay={0.12}>
                  <p className="border-l border-mint/30 pl-5 text-[0.9375rem] leading-[1.75] text-white/45">
                    Diese DAO wurde als Prototyp im Rahmen einer Bachelor Thesis
                    an der ZHAW entwickelt, um die praktische Umsetzung und
                    Anwendbarkeit von DAOs in der modernen
                    Organisationsgestaltung zu erforschen.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Feature grid */}
            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <SpotlightCard className="h-full !rounded-none !border-0 bg-ink-950 p-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-mint">
                      <Icon size={19} />
                    </div>
                    <h3 className="mt-5 text-[0.9375rem] font-semibold tracking-tight text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-white/45">
                      {desc}
                    </p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Dashboard showcase                                                */}
        {/* ================================================================== */}
        <section
          id="dashboard"
          className="relative scroll-mt-28 overflow-hidden px-5 py-20 sm:px-6 lg:py-28"
        >
          <div
            className="lp-aurora lp-drift-slow left-1/2 top-10 h-[420px] w-[620px] -translate-x-1/2 opacity-[0.12]"
            style={{ background: "#7C5CFA" }}
          />

          <div className="relative mx-auto max-w-content">
            <SectionHeading
              index="02"
              eyebrow="Produkt"
              title="Das DAO Dashboard"
              lead="Das Dashboard bietet dir einen schnellen Überblick über alle wichtigen DAO-Funktionen und deine persönlichen Aktivitäten."
              align="center"
            />

            {/* Featured frame */}
            <Reveal delay={0.1} y={26}>
              <div className="lp-frame mx-auto mt-14 max-w-4xl">
                <div className="lp-frame-bar">
                  <span className="lp-dot" />
                  <span className="lp-dot" />
                  <span className="lp-dot" />
                  <span className="lp-mono ml-3 truncate text-[0.625rem] text-white/25">
                    thesis-dao.near
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalImage(asset(shots[activeShot].src))}
                  className="group relative block w-full cursor-zoom-in"
                  aria-label={`${shots[activeShot].alt} vergrössern`}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeShot}
                      src={asset(shots[activeShot].src)}
                      alt={shots[activeShot].alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="block w-full"
                    />
                  </AnimatePresence>
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-ink-950/70 text-white/70 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    <IconExpand size={16} />
                  </span>
                </button>
              </div>
            </Reveal>

            {/* Caption selectors */}
            <div className="mx-auto mt-8 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
              {shots.map((shot, i) => (
                <button
                  key={shot.src}
                  type="button"
                  onClick={() => setActiveShot(i)}
                  aria-pressed={activeShot === i}
                  className={`flex items-start gap-3 px-4 py-4 text-left transition-colors duration-300 ${
                    activeShot === i
                      ? "bg-white/[0.06]"
                      : "bg-ink-950 hover:bg-white/[0.03]"
                  }`}
                >
                  <span
                    className={`lp-mono mt-px text-[0.625rem] ${
                      activeShot === i ? "text-mint" : "text-white/25"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`text-[0.8125rem] leading-snug ${
                      activeShot === i ? "text-white" : "text-white/45"
                    }`}
                  >
                    {shot.caption}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Tokenomics                                                        */}
        {/* ================================================================== */}
        <section
          id="tokenomics"
          className="relative scroll-mt-28 px-5 py-20 sm:px-6 lg:py-28"
        >
          <div className="mx-auto max-w-content">
            <SectionHeading
              index="03"
              eyebrow="Verteilung"
              title="Tokenomics"
              lead="Hier erfährst du, wie die Token im Ökosystem verteilt sind und welche Rolle sie für die Community spielen."
            />

            {/* Allocation bar */}
            <Reveal delay={0.1}>
              <div className="mt-14 flex h-3 w-full gap-1 overflow-hidden">
                {allocations.map((a) => (
                  <motion.div
                    key={a.title}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${a.value}%` }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
                    className={`h-full rounded-full ${
                      a.tone === "mint"
                        ? "bg-gradient-to-r from-mint-deep to-mint"
                        : a.tone === "iris"
                        ? "bg-gradient-to-r from-iris-deep to-iris"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </Reveal>

            {/* Legend rows */}
            <div className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {allocations.map(({ icon: Icon, title, desc, value, tone }, i) => (
                <Reveal key={title} delay={i * 0.07}>
                  <div className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex items-center gap-4 sm:w-56">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 ${
                          tone === "mint"
                            ? "bg-mint/10 text-mint"
                            : tone === "iris"
                            ? "bg-iris/10 text-iris"
                            : "bg-white/[0.06] text-white/60"
                        }`}
                      >
                        <Icon size={19} />
                      </span>
                      <span className="font-display text-xl font-medium tracking-tight text-white">
                        {title}
                      </span>
                    </div>

                    <p className="flex-1 text-[0.9375rem] text-white/45">
                      {desc}
                    </p>

                    <span
                      className={`lp-mono text-[2rem] leading-none tracking-tight sm:text-[2.5rem] ${
                        tone === "mint"
                          ? "text-mint"
                          : tone === "iris"
                          ? "text-iris"
                          : "text-white/70"
                      }`}
                    >
                      {value}%
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Roadmap                                                           */}
        {/* ================================================================== */}
        <section
          id="roadmap"
          className="relative scroll-mt-28 overflow-hidden px-5 py-20 sm:px-6 lg:py-28"
        >
          <div className="relative mx-auto max-w-content">
            <SectionHeading
              index="04"
              eyebrow="Meilensteine"
              title="Roadmap"
              lead="Unsere Roadmap zeigt dir die wichtigsten Meilensteine und die geplante Entwicklung der DAO."
            />

            {/* Desktop rail */}
            <div className="relative mt-20 hidden lg:block">
              <div className="absolute left-0 right-0 top-7 h-px bg-white/[0.09]" />
              <motion.div
                className="absolute left-0 top-7 h-px bg-gradient-to-r from-mint to-mint/0"
                initial={{ width: 0 }}
                whileInView={{ width: "22%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE }}
              />
              <div className="relative grid grid-cols-5 gap-6">
                {milestones.map(({ q, title, icon: Icon, done }, i) => (
                  <Reveal key={q} delay={i * 0.08}>
                    <div className="group flex flex-col items-start">
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 ${
                          done
                            ? "border-mint/40 bg-mint/10 text-mint shadow-[0_0_36px_-6px_rgba(94,234,212,0.45)]"
                            : "border-white/10 bg-ink-900 text-white/45 group-hover:border-white/25 group-hover:text-white/75"
                        }`}
                      >
                        <Icon size={21} />
                      </span>
                      <span
                        className={`lp-mono mt-6 text-[0.6875rem] tracking-wider ${
                          done ? "text-mint" : "text-white/35"
                        }`}
                      >
                        {q}
                      </span>
                      <span className="mt-2 text-[0.9375rem] font-medium leading-snug tracking-tight text-white">
                        {title}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Mobile / tablet timeline */}
            <div className="relative mt-14 lg:hidden">
              <div className="absolute bottom-6 left-[27px] top-6 w-px bg-white/[0.09]" />
              <div className="space-y-8">
                {milestones.map(({ q, title, icon: Icon, done }, i) => (
                  <Reveal key={q} delay={i * 0.06}>
                    <div className="flex items-start gap-5">
                      <span
                        className={`relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                          done
                            ? "border-mint/40 bg-mint/10 text-mint shadow-[0_0_36px_-6px_rgba(94,234,212,0.45)]"
                            : "border-white/10 bg-ink-900 text-white/45"
                        }`}
                      >
                        <Icon size={21} />
                      </span>
                      <div className="pt-1.5">
                        <span
                          className={`lp-mono text-[0.6875rem] tracking-wider ${
                            done ? "text-mint" : "text-white/35"
                          }`}
                        >
                          {q}
                        </span>
                        <p className="mt-1.5 text-[1.0625rem] font-medium leading-snug tracking-tight text-white">
                          {title}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  FAQ                                                               */}
        {/* ================================================================== */}
        <section
          id="faq"
          className="relative scroll-mt-28 px-5 py-20 sm:px-6 lg:py-28"
        >
          <div className="mx-auto max-w-content">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading index="05" eyebrow="FAQ" title="Häufige Fragen" />
              </div>

              <div className="border-t border-white/[0.07]">
                {faqs.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <Reveal key={faq.q} delay={Math.min(i, 3) * 0.05}>
                      <div className="border-b border-white/[0.07]">
                        <button
                          onClick={() => setOpenFaq(open ? null : i)}
                          aria-expanded={open}
                          className="flex w-full items-start gap-4 py-6 text-left"
                        >
                          <span
                            className={`lp-mono mt-1 text-[0.6875rem] transition-colors duration-300 ${
                              open ? "text-mint" : "text-white/25"
                            }`}
                          >
                            0{i + 1}
                          </span>
                          <span
                            className={`flex-1 text-[1.0625rem] font-medium leading-snug tracking-tight transition-colors duration-300 ${
                              open ? "text-white" : "text-white/80"
                            }`}
                          >
                            {faq.q}
                          </span>
                          <motion.span
                            animate={{ rotate: open ? 135 : 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className={`mt-0.5 shrink-0 transition-colors duration-300 ${
                              open ? "text-mint" : "text-white/35"
                            }`}
                          >
                            <IconPlus size={18} />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.38, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <p className="pb-7 pl-[2.375rem] pr-8 text-[0.9375rem] leading-[1.75] text-white/50">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Contact                                                           */}
        {/* ================================================================== */}
        <section
          id="contact"
          className="relative scroll-mt-28 px-5 py-20 sm:px-6 lg:py-28"
        >
          <div className="mx-auto max-w-content">
            <SectionHeading
              index="06"
              eyebrow="Kontakt"
              title="Kontakt"
              lead="Hast du Fragen oder möchtest mehr über unser Projekt erfahren? Wir freuen uns auf deine Nachricht!"
              align="center"
            />

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <Reveal>
                <SpotlightCard className="h-full p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-mint">
                    <IconMail size={19} />
                  </div>
                  <h3 className="mt-5 text-[0.9375rem] font-semibold tracking-tight text-white">
                    Email
                  </h3>
                  <a
                    href="mailto:murbalio@students.zhaw.ch"
                    className="lp-mono mt-2 inline-block break-all text-[0.8125rem] text-white/50 transition-colors duration-300 hover:text-mint"
                  >
                    murbalio@students.zhaw.ch
                  </a>
                </SpotlightCard>
              </Reveal>

              {[
                { icon: IconDiscord, label: "Discord" },
                { icon: IconX, label: "Twitter" },
              ].map(({ icon: Icon, label }, i) => (
                <Reveal key={label} delay={0.06 * (i + 1)}>
                  <div className="lp-card h-full p-7 opacity-60">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 text-[0.9375rem] font-semibold tracking-tight text-white/80">
                      {label}
                    </h3>
                    <span className="lp-mono mt-2 inline-block rounded-md border border-white/10 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-white/35">
                      Coming Soon
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Final CTA                                                         */}
        {/* ================================================================== */}
        <section className="relative overflow-hidden px-5 py-20 sm:px-6 lg:py-28">
          <div className="relative mx-auto max-w-content">
            <div className="lp-panel relative overflow-hidden px-6 py-20 text-center sm:px-10 lg:py-28">
              <div className="lp-grid" />
              <div
                className="lp-aurora lp-drift left-1/2 top-full h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-30"
                style={{ background: "#2DD4BF" }}
              />

              <div className="relative">
                <Reveal>
                  <h2 className="lp-display mx-auto max-w-2xl text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] text-white">
                    Bereit mitzumachen?
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/50 sm:text-lg">
                    Werde Teil unserer Community. Diskutiere, vote, entwickle,
                    verwalte.
                  </p>
                </Reveal>
                <Reveal delay={0.14}>
                  <button
                    onClick={connectWallet}
                    className="lp-btn lp-btn--primary mt-10"
                  >
                    <IconWallet size={17} />
                    Jetzt Wallet verbinden
                  </button>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Footer                                                            */}
        {/* ================================================================== */}
        <footer className="border-t border-white/[0.07] px-5 py-12 sm:px-6">
          <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <LogoMark size={22} />
              <span className="font-display text-[0.9375rem] font-semibold text-white/80">
                Thesis DAO
              </span>
            </div>

            <p className="text-center text-[0.8125rem] text-white/35 sm:text-left">
              © {new Date().getFullYear()} Thesis DAO – Built on{" "}
              <span className="text-white/60">NEAR Protocol</span>
            </p>

            <p className="lp-mono text-[0.6875rem] tracking-wider text-white/25">
              Projekt von Lionel Murbach
            </p>
          </div>
        </footer>
      </main>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Nach oben scrollen"
            className="fixed bottom-6 right-5 z-[65] flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-ink-900/85 text-white/70 backdrop-blur-xl transition-colors duration-300 hover:border-mint/40 hover:text-mint sm:bottom-8 sm:right-8"
          >
            <IconArrowUp size={17} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/92 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setModalImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="lp-frame relative max-h-full w-full max-w-5xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={modalImage} alt="Screenshot in voller Grösse" className="block w-full" />
            </motion.div>
            <button
              onClick={() => setModalImage(null)}
              aria-label="Schliessen"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-white/70 backdrop-blur transition-colors hover:border-white/30 hover:text-white"
            >
              <IconClose size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
