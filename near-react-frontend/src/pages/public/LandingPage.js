import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

import { scrollToId } from "./scroll";
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
  { title: "Umlauf", desc: "60% Community-basiert", value: 60, fill: "#FFFFFF" },
  {
    title: "Treasury",
    desc: "30% für Entwicklung & Finanzierung",
    value: 30,
    fill: "#8A8A8A",
  },
  {
    title: "Team",
    desc: "10% für Core-Contributors",
    value: 10,
    fill: "#3D3D3D",
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

const Reveal = ({ children, delay = 0, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/** Centred section heading with plenty of air beneath it. */
const Heading = ({ eyebrow, title, lead }) => (
  <div className="mx-auto max-w-3xl text-center">
    <Reveal>
      <span className="lp-label">{eyebrow}</span>
    </Reveal>
    <Reveal delay={0.05}>
      <h2 className="lp-h2 mt-6">{title}</h2>
    </Reveal>
    {lead && (
      <Reveal delay={0.1}>
        <p className="lp-lead mx-auto mt-7 max-w-2xl">{lead}</p>
      </Reveal>
    )}
  </div>
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
    const onScroll = () => setShowTop(window.scrollY > 1000);
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
    <div className="lp min-h-screen overflow-x-clip">
      <Header connectWallet={connectWallet} />

      <main>
        {/* ================================================================== */}
        {/*  Hero                                                              */}
        {/* ================================================================== */}
        <section id="hero" className="relative scroll-mt-24 overflow-hidden">
          <div className="lp-halo" />

          <div className="lp-wrap relative pb-20 pt-40 text-center sm:pt-44 lg:pb-24 lg:pt-52">
            <Reveal>
              <div className="lp-pill mx-auto">
                <span className="lp-live" />
                <span className="lp-mono text-[0.6875rem] leading-none text-fg-body">
                  Ein Prototyp im Rahmen einer Bachelor Thesis an der ZHAW
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="lp-h1 mx-auto mt-12 max-w-[16ch]">Thesis DAO</h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lp-lead mx-auto mt-10 max-w-[38ch]">
                Demokratisch. Transparent. Community Driven. Built on NEAR.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={connectWallet}
                  className="lp-btn lp-btn--primary !flex w-full sm:!inline-flex sm:w-auto"
                >
                  Wallet verbinden &amp; starten
                </button>
                <button
                  onClick={() => scrollToId("about")}
                  className="lp-btn lp-btn--ghost !flex w-full sm:!inline-flex sm:w-auto group"
                >
                  Mehr erfahren
                  <IconArrowRight
                    size={15}
                    className="text-fg-muted transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </Reveal>
          </div>

          {/* Product shot */}
          <div className="lp-wrap relative pb-24 lg:pb-32">
            <Reveal delay={0.12}>
              <div className="lp-frame mx-auto max-w-5xl">
                <div className="lp-frame-bar">
                  <span className="lp-dot" />
                  <span className="lp-dot" />
                  <span className="lp-dot" />
                  <span className="lp-mono ml-3 truncate text-[0.6875rem] text-fg-faint">
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
                      transition={{ duration: 0.3 }}
                      className="block w-full"
                    />
                  </AnimatePresence>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-black/70 text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                    <IconExpand size={16} />
                  </span>
                </button>
              </div>
            </Reveal>

            {/* Shot selector */}
            <Reveal delay={0.16}>
              <div className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-3">
                {shots.map((shot, i) => (
                  <button
                    key={shot.src}
                    type="button"
                    onClick={() => setActiveShot(i)}
                    aria-pressed={activeShot === i}
                    className={`lp-card flex items-start gap-3 px-5 py-4 text-left ${
                      activeShot === i
                        ? "!border-line-loud !bg-s2"
                        : "lp-card--hover"
                    }`}
                  >
                    <span
                      className={`lp-mono mt-px text-[0.625rem] ${
                        activeShot === i ? "text-white" : "text-fg-faint"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-[0.8125rem] leading-snug ${
                        activeShot === i ? "text-white" : "text-fg-muted"
                      }`}
                    >
                      {shot.caption}
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* --- Ticker ------------------------------------------------------- */}
        <div className="lp-rule" />
        <div className="lp-marquee relative overflow-hidden py-6">
          <div className="lp-marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {tickerPhrases.map((phrase, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center">
                    <span className="lp-label whitespace-nowrap px-10">
                      {phrase}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-line-loud" />
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
        </div>
        <div className="lp-rule" />

        {/* ================================================================== */}
        {/*  Token sale                                                        */}
        {/* ================================================================== */}
        <section className="lp-section">
          <div className="lp-wrap">
            <div className="lp-panel mx-auto max-w-4xl p-8 sm:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="lp-label">Token Sale</span>
                <span className="lp-mono rounded-md border border-line-strong bg-s3 px-2.5 py-1 text-[0.6875rem] text-white">
                  {sale.symbol || "THESISDAO"}
                </span>
              </div>

              {sale.loading ? (
                <div className="mt-10 h-2 w-full animate-pulse rounded-full bg-s3" />
              ) : (
                <>
                  <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="lp-mono text-[2.5rem] leading-none tracking-tight text-white sm:text-[3.25rem]">
                      {sale.failed ? "—" : nf(soldHuman)}
                    </span>
                    <span className="lp-mono text-base text-fg-muted">
                      / {nf(HARDCAP)}
                    </span>
                    <span className="lp-mono ml-auto text-lg text-white">
                      {sale.failed ? "n/a" : `${percent.toFixed(2)}%`}
                    </span>
                  </div>

                  <div className="lp-meter mt-8">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
                    />
                  </div>

                  <p className="lp-mono mt-4 text-[0.6875rem] text-fg-faint">
                    {sale.failed ? "Sale-Stand nicht verfügbar" : "verkauft"}
                  </p>
                </>
              )}

              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {pillars.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-s2 px-4 py-3.5"
                  >
                    <Icon size={16} className="shrink-0 text-white" />
                    <span className="text-[0.8125rem] text-fg-body">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  About                                                             */}
        {/* ================================================================== */}
        <section id="about" className="lp-section scroll-mt-24">
          <div className="lp-wrap">
            <Heading eyebrow="Über uns" title="Was ist diese DAO?" />

            <div className="mx-auto mt-14 max-w-3xl space-y-8 text-center lg:mt-16">
              <Reveal>
                <p className="lp-lead">
                  Eine DAO (Decentralized Autonomous Organization) ist eine
                  digitale Organisation, die von ihren Mitgliedern
                  gemeinschaftlich gesteuert wird. Entscheidungen werden
                  transparent und demokratisch getroffen – ohne zentrale Instanz.
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="lp-lead">
                  Mit dem Kauf von Tokens wirst du Teil der DAO und erhältst die
                  gleichen Rechte wie ein Aktionär einer traditionellen AG – oder
                  sogar noch mehr: Du kannst mitbestimmen, Vorschläge einbringen
                  und direkt an der Entwicklung und Verwaltung der Organisation
                  teilnehmen.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lp-body mx-auto max-w-2xl">
                  Diese DAO wurde als Prototyp im Rahmen einer Bachelor Thesis an
                  der ZHAW entwickelt, um die praktische Umsetzung und
                  Anwendbarkeit von DAOs in der modernen Organisationsgestaltung
                  zu erforschen.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <div className="lp-card lp-card--hover h-full p-7">
                    <span className="lp-chip">
                      <Icon size={19} />
                    </span>
                    <h3 className="lp-h3 mt-7">{title}</h3>
                    <p className="lp-body mt-3">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Tokenomics                                                        */}
        {/* ================================================================== */}
        <section id="tokenomics" className="lp-section scroll-mt-24">
          <div className="lp-wrap">
            <Heading
              eyebrow="Verteilung"
              title="Tokenomics"
              lead="Hier erfährst du, wie die Token im Ökosystem verteilt sind und welche Rolle sie für die Community spielen."
            />

            <Reveal delay={0.1}>
              <div className="mx-auto mt-16 flex h-3 max-w-4xl gap-1.5 lg:mt-20">
                {allocations.map((a) => (
                  <motion.div
                    key={a.title}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${a.value}%` }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                    className="h-full rounded-full"
                    style={{ background: a.fill }}
                  />
                ))}
              </div>
            </Reveal>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              {allocations.map(({ title, desc, value, fill }, i) => (
                <Reveal key={title} delay={i * 0.07}>
                  <div className="lp-card lp-card--hover h-full p-7">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: fill }}
                        aria-hidden="true"
                      />
                      <span className="lp-label">{title}</span>
                    </div>
                    <div className="lp-mono mt-7 text-[3rem] leading-none tracking-tight text-white">
                      {value}%
                    </div>
                    <p className="lp-body mt-4">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  Roadmap                                                           */}
        {/* ================================================================== */}
        <section id="roadmap" className="lp-section scroll-mt-24">
          <div className="lp-wrap">
            <Heading
              eyebrow="Meilensteine"
              title="Roadmap"
              lead="Unsere Roadmap zeigt dir die wichtigsten Meilensteine und die geplante Entwicklung der DAO."
            />

            <div className="mx-auto mt-16 max-w-4xl space-y-3 lg:mt-20">
              {milestones.map(({ q, title, icon: Icon, done }, i) => (
                <Reveal key={q} delay={i * 0.05}>
                  <div
                    className={`lp-card lp-card--hover flex items-center gap-5 px-6 py-6 sm:gap-8 sm:px-8 ${
                      done ? "!border-line-loud" : ""
                    }`}
                  >
                    <span className="lp-mono w-[4.5rem] shrink-0 text-[0.75rem] text-fg-muted">
                      {q}
                    </span>

                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                        done
                          ? "border-white bg-white text-black"
                          : "border-line-strong bg-s3 text-fg-body"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="min-w-0 flex-1 text-[1rem] font-medium tracking-[-0.02em] text-white sm:text-[1.125rem]">
                      {title}
                    </span>

                    <span
                      className={`lp-mono hidden shrink-0 rounded-md border px-2.5 py-1 text-[0.625rem] uppercase tracking-wider sm:block ${
                        done
                          ? "border-white/50 text-white"
                          : "border-line-strong text-fg-muted"
                      }`}
                    >
                      {done ? "Live" : "Geplant"}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/*  FAQ                                                               */}
        {/* ================================================================== */}
        <section id="faq" className="lp-section scroll-mt-24">
          <div className="lp-wrap">
            <Heading eyebrow="FAQ" title="Häufige Fragen" />

            <div className="mx-auto mt-16 max-w-3xl space-y-3 lg:mt-20">
              {faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <Reveal key={faq.q} delay={Math.min(i, 4) * 0.04}>
                    <div
                      className={`lp-card overflow-hidden ${
                        open ? "!border-line-loud !bg-s2" : "lp-card--hover"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        className="flex w-full items-start gap-5 px-6 py-6 text-left sm:px-8"
                      >
                        <span
                          className={`lp-mono mt-1 text-[0.6875rem] ${
                            open ? "text-white" : "text-fg-faint"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <span className="flex-1 text-[1rem] font-medium leading-snug tracking-[-0.02em] text-white sm:text-[1.125rem]">
                          {faq.q}
                        </span>
                        <motion.span
                          animate={{ rotate: open ? 45 : 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className={`mt-0.5 shrink-0 ${
                            open ? "text-white" : "text-fg-muted"
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
                            transition={{ duration: 0.32, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="lp-body pb-7 pl-[2.9rem] pr-8 sm:pl-[3.9rem] sm:pr-14">
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
        </section>

        {/* ================================================================== */}
        {/*  Contact                                                           */}
        {/* ================================================================== */}
        <section id="contact" className="lp-section scroll-mt-24">
          <div className="lp-wrap">
            <Heading
              eyebrow="Kontakt"
              title="Kontakt"
              lead="Hast du Fragen oder möchtest mehr über unser Projekt erfahren? Wir freuen uns auf deine Nachricht!"
            />

            <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3 lg:mt-20">
              <Reveal>
                <a
                  href="mailto:murbalio@students.zhaw.ch"
                  className="lp-card lp-card--hover group flex h-full flex-col p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="lp-chip">
                      <IconMail size={19} />
                    </span>
                    <IconArrowRight
                      size={16}
                      className="mt-3 text-fg-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white"
                    />
                  </div>
                  <h3 className="lp-h3 mt-7">Email</h3>
                  <span className="lp-mono mt-2 block break-all text-[0.75rem] text-fg-muted">
                    murbalio@students.zhaw.ch
                  </span>
                </a>
              </Reveal>

              {[
                { icon: IconDiscord, label: "Discord" },
                { icon: IconX, label: "Twitter" },
              ].map(({ icon: Icon, label }, i) => (
                <Reveal key={label} delay={0.06 * (i + 1)}>
                  <div className="lp-card flex h-full flex-col p-7">
                    <span className="lp-chip !text-fg-muted">
                      <Icon size={18} />
                    </span>
                    <h3 className="lp-h3 mt-7 !text-fg-body">{label}</h3>
                    <span className="lp-mono mt-2 inline-block w-fit rounded-md border border-line-strong px-2 py-1 text-[0.625rem] uppercase tracking-wider text-fg-muted">
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
        <section className="relative overflow-hidden">
          <div className="lp-wrap">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-s1 px-6 py-24 text-center sm:px-12 lg:py-32">
              <div className="lp-halo !bottom-[-20rem] !top-auto !h-[36rem]" />
              <div className="relative">
                <Reveal>
                  <h2 className="lp-h2 mx-auto max-w-[18ch]">
                    Bereit mitzumachen?
                  </h2>
                </Reveal>
                <Reveal delay={0.06}>
                  <p className="lp-lead mx-auto mt-8 max-w-[42ch]">
                    Werde Teil unserer Community. Diskutiere, vote, entwickle,
                    verwalte.
                  </p>
                </Reveal>
                <Reveal delay={0.12}>
                  <button
                    onClick={connectWallet}
                    className="lp-btn lp-btn--primary mt-12"
                  >
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
        <footer className="mt-28 border-t border-line lg:mt-36">
          <div className="lp-wrap flex flex-col items-center gap-6 py-12 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <LogoMark size={20} className="text-fg-muted" />
              <span className="text-[0.875rem] text-fg-muted">
                © {new Date().getFullYear()} Thesis DAO – Built on{" "}
                <span className="text-white">NEAR Protocol</span>
              </span>
            </div>
            <span className="lp-mono text-[0.6875rem] text-fg-faint">
              Projekt von Lionel Murbach
            </span>
          </div>
        </footer>
      </main>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Nach oben scrollen"
            className="fixed bottom-6 right-6 z-[65] flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong bg-s2 text-fg-body transition-colors duration-200 hover:border-line-loud hover:text-white sm:bottom-10 sm:right-10"
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/[0.92] p-4 backdrop-blur-sm sm:p-12"
            onClick={() => setModalImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="lp-frame max-h-full w-full max-w-6xl overflow-auto"
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
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-s2 text-fg-body transition-colors hover:border-line-loud hover:text-white"
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
