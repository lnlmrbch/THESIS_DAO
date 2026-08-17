import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  IconExpand,
  IconEye,
  IconHandshake,
  IconMail,
  IconPlus,
  IconRocket,
  IconToken,
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
    title: "Umlauf",
    desc: "60% Community-basiert",
    value: 60,
    fill: "#EDEDED",
  },
  {
    title: "Treasury",
    desc: "30% für Entwicklung & Finanzierung",
    value: 30,
    fill: "#6E6E6E",
  },
  {
    title: "Team",
    desc: "10% für Core-Contributors",
    value: 10,
    fill: "#2E2E2E",
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

const pillars = [
  { icon: IconWallet, label: "Wallet" },
  { icon: IconToken, label: "Token" },
  { icon: IconChart, label: "Dashboard" },
  { icon: IconUsers, label: "Community" },
];

const EASE = [0.16, 1, 0.3, 1];
const asset = (file) => `${process.env.PUBLIC_URL}/screenshots/${file}`;

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

/** Fade + 8px lift. Deliberately restrained — nothing swoops. */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/** Horizontal band inside the shell. Rules come from .lp-band. */
const Band = ({ id, className = "", children }) => (
  <section
    id={id}
    className={`lp-band relative ${id ? "scroll-mt-16" : ""} ${className}`}
  >
    {children}
  </section>
);

/** Section label: 01 / ÜBER UNS */
const Label = ({ index, children }) => (
  <div className="flex items-center gap-2.5">
    <span className="lp-mono text-[0.6875rem] text-fg">{index}</span>
    <span className="h-px w-6 bg-edge-strong" />
    <span className="lp-label">{children}</span>
  </div>
);

/** Crosshairs on the four corners of a bordered block. */
const Crosses = () => (
  <>
    <span className="lp-cross -left-[5px] -top-[5px]" />
    <span className="lp-cross -right-[5px] -top-[5px]" />
    <span className="lp-cross -bottom-[5px] -left-[5px]" />
    <span className="lp-cross -bottom-[5px] -right-[5px]" />
  </>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const LandingPage = () => {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [activeShot, setActiveShot] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const shellRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { selector } = await initWalletSelector();
        if (selector.store.getState().accounts.length > 0) navigate("/dashboard");
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
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!modalImage) return undefined;
    const onKey = (e) => e.key === "Escape" && setModalImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalImage]);

  /* ---- Token sale ------------------------------------------------------- */

  const HARDCAP = 10_000_000;
  const [sale, setSale] = useState({
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
        const view = async (method, args = {}) => {
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

        /* Never leave the strip stuck in its skeleton if the RPC hangs. */
        const withTimeout = (promise, ms = 9000) =>
          Promise.race([
            promise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("RPC timeout")), ms)
            ),
          ]);

        const [meta, totalSupply, tokenPool] = await withTimeout(
          Promise.all([
            view("ft_metadata"),
            view("get_total_supply"),
            view("get_token_pool"),
          ])
        );

        setSale({
          sold: (parseFloat(totalSupply) - parseFloat(tokenPool)).toString(),
          symbol: meta?.symbol || "TOKEN",
          decimals: meta?.decimals ?? 24,
          loading: false,
          failed: false,
        });
      } catch (err) {
        console.error("Fehler beim Laden des Token Sale Stands:", err);
        setSale((prev) => ({ ...prev, loading: false, failed: true }));
      }
    })();
  }, []);

  const soldHuman = sale.sold
    ? parseFloat(sale.sold) / Math.pow(10, sale.decimals)
    : 0;
  const percent = soldHuman ? Math.min(100, (soldHuman / HARDCAP) * 100) : 0;
  const nf = (n) => n.toLocaleString("de-CH", { maximumFractionDigits: 0 });

  return (
    <div className="lp min-h-screen">
      <Header connectWallet={connectWallet} />

      <div ref={shellRef} className="lp-shell relative">
        {/* ================================================================== */}
        {/*  Hero                                                              */}
        {/* ================================================================== */}
        <Band id="hero" className="overflow-hidden pt-16">
          <div className="lp-rules" />

          <div className="relative px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-edge bg-surface-1 py-1 pl-2.5 pr-3.5">
                <span className="lp-live" />
                <span className="lp-mono text-[0.6875rem] leading-none text-fg-muted">
                  Ein Prototyp im Rahmen einer Bachelor Thesis an der ZHAW
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <h1 className="lp-h1 mt-8 max-w-[14ch] text-fg">Thesis DAO</h1>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="lp-lead mt-7 max-w-[46ch]">
                Demokratisch. Transparent. Community Driven. Built on NEAR.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-9 flex flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={connectWallet}
                  className="lp-btn lp-btn--primary !flex sm:!inline-flex"
                >
                  Wallet verbinden &amp; starten
                </button>
                <ScrollLink
                  to="about"
                  smooth
                  duration={500}
                  offset={-64}
                  tabIndex={0}
                  role="button"
                  className="lp-btn lp-btn--ghost !flex sm:!inline-flex group"
                >
                  Mehr erfahren
                  <IconArrowRight
                    size={15}
                    className="text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </ScrollLink>
              </div>
            </Reveal>
          </div>
        </Band>

        {/* --- Token sale strip -------------------------------------------- */}
        <Band>
          <div className="lp-grid sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="lp-cell px-5 py-6 sm:px-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="lp-label">Token Sale</span>
                <span className="lp-mono text-[0.6875rem] text-fg-subtle">
                  {sale.symbol || "THESISDAO"}
                </span>
              </div>

              {sale.loading ? (
                <div className="mt-5 h-1.5 w-full animate-pulse rounded-full bg-surface-3" />
              ) : (
                <>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="lp-mono text-[1.75rem] leading-none tracking-tight text-fg">
                      {sale.failed ? "—" : nf(soldHuman)}
                    </span>
                    <span className="lp-mono text-sm text-fg-faint">
                      / {nf(HARDCAP)}
                    </span>
                    <span className="lp-mono ml-auto text-sm text-fg-muted">
                      {sale.failed ? "n/a" : `${percent.toFixed(2)}%`}
                    </span>
                  </div>
                  <div className="lp-meter mt-4">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: EASE }}
                    />
                  </div>
                  <p className="lp-mono mt-3 text-[0.6875rem] text-fg-faint">
                    {sale.failed ? "Sale-Stand nicht verfügbar" : "verkauft"}
                  </p>
                </>
              )}
            </div>

            <div className="lp-grid grid-cols-2 sm:w-[22rem] sm:grid-cols-2">
              {pillars.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="lp-cell lp-cell--hover flex items-center gap-2.5 px-5 py-4"
                >
                  <Icon size={15} className="shrink-0 text-fg-subtle" />
                  <span className="text-[0.8125rem] text-fg-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Band>

        {/* --- Ticker ------------------------------------------------------- */}
        <Band>
          <div className="lp-marquee relative overflow-hidden py-3.5">
            <div className="lp-marquee-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 items-center">
                  {tickerPhrases.map((phrase, i) => (
                    <span key={`${dup}-${i}`} className="flex items-center">
                      <span className="lp-label whitespace-nowrap px-8">
                        {phrase}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-edge-loud" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface-0 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface-0 to-transparent" />
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  Product                                                           */}
        {/* ================================================================== */}
        <Band id="dashboard">
          <div className="px-5 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-20">
            <Reveal>
              <Label index="01">Produkt</Label>
            </Reveal>
            <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal delay={0.04}>
                <h2 className="lp-h2 max-w-[16ch] text-fg">
                  Das DAO Dashboard
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="lp-lead max-w-[52ch] lg:text-right">
                  Das Dashboard bietet dir einen schnellen Überblick über alle
                  wichtigen DAO-Funktionen und deine persönlichen Aktivitäten.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Caption tabs */}
          <div className="lp-grid border-t border-edge sm:grid-cols-3">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                onClick={() => setActiveShot(i)}
                aria-pressed={activeShot === i}
                className={`lp-cell relative flex items-start gap-3 px-5 py-4 text-left transition-colors duration-200 sm:px-6 ${
                  activeShot === i ? "!bg-surface-2" : "hover:!bg-surface-1"
                }`}
              >
                {activeShot === i && (
                  <motion.span
                    layoutId="shot-underline"
                    className="absolute inset-x-0 top-0 h-px bg-fg"
                    transition={{ duration: 0.28, ease: EASE }}
                  />
                )}
                <span
                  className={`lp-mono mt-px text-[0.625rem] ${
                    activeShot === i ? "text-fg" : "text-fg-faint"
                  }`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`text-[0.8125rem] leading-snug ${
                    activeShot === i ? "text-fg" : "text-fg-subtle"
                  }`}
                >
                  {shot.caption}
                </span>
              </button>
            ))}
          </div>

          {/* Screenshot */}
          <div className="border-t border-edge bg-surface-1 px-5 py-10 sm:px-8 sm:py-14">
            <Reveal>
              {/* Crosshairs live on the wrapper — .lp-frame clips its overflow. */}
              <div className="relative mx-auto max-w-4xl">
                <Crosses />
                <div className="lp-frame">
                <div className="lp-frame-bar">
                  <span className="lp-dot" />
                  <span className="lp-dot" />
                  <span className="lp-dot" />
                  <span className="lp-mono ml-3 truncate text-[0.625rem] text-fg-faint">
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
                      transition={{ duration: 0.25 }}
                      className="block w-full"
                    />
                  </AnimatePresence>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-edge-strong bg-surface-0/80 text-fg-muted opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                    <IconExpand size={15} />
                  </span>
                </button>
                </div>
              </div>
            </Reveal>
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  About                                                             */}
        {/* ================================================================== */}
        <Band id="about">
          <div className="grid lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div className="px-5 pb-10 pt-16 sm:px-8 sm:pt-20 lg:border-r lg:border-edge lg:pb-20">
              <div className="lg:sticky lg:top-24">
                <Reveal>
                  <Label index="02">Über uns</Label>
                </Reveal>
                <Reveal delay={0.04}>
                  <h2 className="lp-h2 mt-7 max-w-[12ch] text-fg">
                    Was ist diese DAO?
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mt-10 max-w-[46ch] border-l border-edge-strong pl-5 text-[0.875rem] leading-[1.7] text-fg-subtle">
                    Diese DAO wurde als Prototyp im Rahmen einer Bachelor Thesis
                    an der ZHAW entwickelt, um die praktische Umsetzung und
                    Anwendbarkeit von DAOs in der modernen
                    Organisationsgestaltung zu erforschen.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="space-y-5 px-5 pb-16 pt-2 sm:px-8 sm:pb-20 lg:pt-20">
              <Reveal>
                <p className="lp-lead max-w-[62ch] text-fg-muted">
                  Eine DAO (Decentralized Autonomous Organization) ist eine
                  digitale Organisation, die von ihren Mitgliedern
                  gemeinschaftlich gesteuert wird. Entscheidungen werden
                  transparent und demokratisch getroffen – ohne zentrale Instanz.
                </p>
              </Reveal>
              <Reveal delay={0.04}>
                <p className="lp-lead max-w-[62ch] text-fg-muted">
                  Mit dem Kauf von Tokens wirst du Teil der DAO und erhältst die
                  gleichen Rechte wie ein Aktionär einer traditionellen AG – oder
                  sogar noch mehr: Du kannst mitbestimmen, Vorschläge einbringen
                  und direkt an der Entwicklung und Verwaltung der Organisation
                  teilnehmen.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Feature cells */}
          <div className="lp-grid border-t border-edge sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="lp-cell lp-cell--hover group px-5 py-8 sm:px-6"
              >
                <Reveal delay={i * 0.04}>
                  <div className="flex items-center justify-between">
                    <Icon
                      size={18}
                      className="text-fg-subtle transition-colors duration-200 group-hover:text-fg"
                    />
                    <span className="lp-mono text-[0.625rem] text-fg-faint">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[0.9375rem] font-medium tracking-[-0.015em] text-fg">
                    {title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.65] text-fg-subtle">
                    {desc}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  Tokenomics                                                        */}
        {/* ================================================================== */}
        <Band id="tokenomics">
          <div className="px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
            <Reveal>
              <Label index="03">Verteilung</Label>
            </Reveal>
            <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal delay={0.04}>
                <h2 className="lp-h2 text-fg">Tokenomics</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="lp-lead max-w-[52ch] lg:text-right">
                  Hier erfährst du, wie die Token im Ökosystem verteilt sind und
                  welche Rolle sie für die Community spielen.
                </p>
              </Reveal>
            </div>

            {/* Segmented allocation bar */}
            <Reveal delay={0.1}>
              <div className="mt-12 flex h-2 w-full gap-1 overflow-hidden">
                {allocations.map((a) => (
                  <motion.div
                    key={a.title}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${a.value}%` }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
                    className="h-full rounded-sm"
                    style={{ background: a.fill }}
                  />
                ))}
              </div>
            </Reveal>
          </div>

          {/* Allocation table */}
          <div className="border-t border-edge">
            {allocations.map(({ title, desc, value, fill }, i) => (
              <div
                key={title}
                className={`group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-5 py-6 transition-colors duration-200 hover:bg-surface-1 sm:grid-cols-[minmax(0,13rem)_1fr_auto] sm:px-8 ${
                  i > 0 ? "border-t border-edge-soft" : ""
                }`}
              >
                <span className="flex items-center gap-3 text-[1.0625rem] font-medium tracking-[-0.02em] text-fg">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ background: fill }}
                    aria-hidden="true"
                  />
                  {title}
                </span>
                <span className="col-span-2 text-[0.8125rem] text-fg-subtle sm:col-span-1 sm:text-[0.875rem]">
                  {desc}
                </span>
                <span className="lp-mono col-start-2 row-start-1 text-right text-[1.5rem] leading-none tracking-tight text-fg sm:col-start-3 sm:text-[1.75rem]">
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  Roadmap                                                           */}
        {/* ================================================================== */}
        <Band id="roadmap">
          <div className="px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
            <Reveal>
              <Label index="04">Meilensteine</Label>
            </Reveal>
            <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal delay={0.04}>
                <h2 className="lp-h2 text-fg">Roadmap</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="lp-lead max-w-[52ch] lg:text-right">
                  Unsere Roadmap zeigt dir die wichtigsten Meilensteine und die
                  geplante Entwicklung der DAO.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="border-t border-edge">
            {milestones.map(({ q, title, icon: Icon, done }, i) => (
              <Reveal key={q} delay={Math.min(i, 4) * 0.03}>
                <div
                  className={`group flex items-center gap-4 px-5 py-5 transition-colors duration-200 hover:bg-surface-1 sm:gap-6 sm:px-8 ${
                    i > 0 ? "border-t border-edge-soft" : ""
                  }`}
                >
                  <span className="lp-mono w-[4.5rem] shrink-0 text-[0.75rem] text-fg-subtle">
                    {q}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${
                      done
                        ? "border-fg bg-fg text-black"
                        : "border-edge-strong text-fg-faint group-hover:border-edge-loud group-hover:text-fg-subtle"
                    }`}
                  >
                    <Icon size={15} />
                  </span>

                  <span className="min-w-0 flex-1 text-[0.9375rem] font-medium tracking-[-0.015em] text-fg sm:text-[1.0625rem]">
                    {title}
                  </span>

                  <span
                    className={`lp-mono hidden shrink-0 rounded border px-2 py-0.5 text-[0.625rem] uppercase tracking-wider sm:block ${
                      done
                        ? "border-edge-loud text-fg"
                        : "border-edge text-fg-faint"
                    }`}
                  >
                    {done ? "Live" : "Geplant"}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  FAQ                                                               */}
        {/* ================================================================== */}
        <Band id="faq">
          <div className="grid lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div className="px-5 pb-6 pt-16 sm:px-8 sm:pt-20 lg:border-r lg:border-edge lg:pb-20">
              <div className="lg:sticky lg:top-24">
                <Reveal>
                  <Label index="05">FAQ</Label>
                </Reveal>
                <Reveal delay={0.04}>
                  <h2 className="lp-h2 mt-7 max-w-[10ch] text-fg">
                    Häufige Fragen
                  </h2>
                </Reveal>
              </div>
            </div>

            <div className="lg:pt-6">
              {faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={faq.q}
                    className={i > 0 ? "border-t border-edge-soft" : ""}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-surface-1 sm:px-8"
                    >
                      <span
                        className={`lp-mono mt-1 text-[0.625rem] ${
                          open ? "text-fg" : "text-fg-faint"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span className="flex-1 text-[0.9375rem] font-medium leading-snug tracking-[-0.015em] text-fg sm:text-[1.0625rem]">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className={`mt-0.5 shrink-0 ${
                          open ? "text-fg" : "text-fg-faint"
                        }`}
                      >
                        <IconPlus size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[68ch] pb-6 pl-[2.4rem] pr-6 text-[0.875rem] leading-[1.75] text-fg-subtle sm:pl-[3.4rem] sm:pr-10">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  Contact                                                           */}
        {/* ================================================================== */}
        <Band id="contact">
          <div className="px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
            <Reveal>
              <Label index="06">Kontakt</Label>
            </Reveal>
            <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Reveal delay={0.04}>
                <h2 className="lp-h2 text-fg">Kontakt</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="lp-lead max-w-[52ch] lg:text-right">
                  Hast du Fragen oder möchtest mehr über unser Projekt erfahren?
                  Wir freuen uns auf deine Nachricht!
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lp-grid border-t border-edge sm:grid-cols-3">
            <a
              href="mailto:murbalio@students.zhaw.ch"
              className="lp-cell lp-cell--hover group flex flex-col justify-between gap-8 px-5 py-8 sm:px-6"
            >
              <div className="flex items-center justify-between">
                <IconMail
                  size={18}
                  className="text-fg-subtle transition-colors duration-200 group-hover:text-fg"
                />
                <IconArrowRight
                  size={15}
                  className="text-fg-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
                />
              </div>
              <div>
                <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em] text-fg">
                  Email
                </h3>
                <span className="lp-mono mt-1.5 block break-all text-[0.75rem] text-fg-subtle">
                  murbalio@students.zhaw.ch
                </span>
              </div>
            </a>

            {[
              { icon: IconDiscord, label: "Discord" },
              { icon: IconX, label: "Twitter" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="lp-cell flex flex-col justify-between gap-8 px-5 py-8 sm:px-6"
              >
                <Icon size={17} className="text-fg-faint" />
                <div>
                  <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em] text-fg-muted">
                    {label}
                  </h3>
                  <span className="lp-mono mt-1.5 inline-block rounded border border-edge px-1.5 py-0.5 text-[0.625rem] uppercase tracking-wider text-fg-faint">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  Final CTA                                                         */}
        {/* ================================================================== */}
        <Band className="overflow-hidden">
          <div className="lp-rules opacity-40" />
          <div className="relative px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="lp-h2 max-w-[16ch] text-fg">Bereit mitzumachen?</h2>
            </Reveal>
            <Reveal delay={0.04}>
              <p className="lp-lead mt-6 max-w-[46ch]">
                Werde Teil unserer Community. Diskutiere, vote, entwickle,
                verwalte.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <button
                onClick={connectWallet}
                className="lp-btn lp-btn--primary !flex mt-9 sm:!inline-flex"
              >
                Jetzt Wallet verbinden
              </button>
            </Reveal>
          </div>
        </Band>

        {/* ================================================================== */}
        {/*  Footer                                                            */}
        {/* ================================================================== */}
        <Band>
          <div className="flex flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-2.5">
              <LogoMark size={18} className="text-fg-subtle" />
              <span className="text-[0.8125rem] text-fg-muted">
                © {new Date().getFullYear()} Thesis DAO – Built on{" "}
                <span className="text-fg">NEAR Protocol</span>
              </span>
            </div>
            <span className="lp-mono text-[0.6875rem] text-fg-faint">
              Projekt von Lionel Murbach
            </span>
          </div>
        </Band>
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: EASE }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Nach oben scrollen"
            className="fixed bottom-5 right-5 z-[65] flex h-10 w-10 items-center justify-center rounded-lg border border-edge-strong bg-surface-1 text-fg-muted transition-colors duration-200 hover:border-edge-loud hover:text-fg sm:bottom-8 sm:right-8"
          >
            <IconArrowUp size={16} />
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
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 sm:p-10"
            onClick={() => setModalImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="lp-frame max-h-full w-full max-w-5xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Screenshot in voller Grösse"
                className="block w-full"
              />
            </div>
            <button
              onClick={() => setModalImage(null)}
              aria-label="Schliessen"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg border border-edge-strong bg-surface-1 text-fg-muted transition-colors hover:border-edge-loud hover:text-fg"
            >
              <IconClose size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
