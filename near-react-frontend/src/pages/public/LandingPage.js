import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { initWalletSelector } from "../../wallet";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import Header from "../public/Header";
import { FaRocket, FaGem, FaExchangeAlt, FaTools, FaUsers, FaChartLine, FaCheck, FaWrench, FaBullhorn, FaRocket as FaRocket2, FaChevronDown, FaPlus, FaMinus, FaHandshake, FaVoteYea, FaArrowRight, FaEnvelope, FaDiscord, FaTwitter, FaWallet, FaEye } from "react-icons/fa";
import { providers } from "near-api-js";

const faqs = [
  { 
    q: "Was ist eine DAO?", 
    a: "Eine DAO (Decentralized Autonomous Organization) ist eine digitale Organisation, die von ihren Mitgliedern gemeinschaftlich gesteuert wird. Entscheidungen werden transparent und demokratisch getroffen – ohne zentrale Instanz. Alle Transaktionen und Abstimmungen sind auf der Blockchain nachvollziehbar."
  },
  { 
    q: "Wie kann ich mitmachen?", 
    a: "Verbinde einfach deine NEAR Wallet, erwerbe THESISDAO Tokens und schon kannst du an Abstimmungen teilnehmen, Proposals erstellen und die Zukunft der DAO mitgestalten. Je mehr Tokens du besitzt, desto mehr Stimmgewicht hast du bei Entscheidungen."
  },
  { 
    q: "Was kostet die Teilnahme?", 
    a: "Du benötigst nur NEAR für die Transaktionen auf der Blockchain. Es gibt keine versteckten Gebühren oder Mitgliedsbeiträge. Die Kosten für Transaktionen sind minimal und transparent."
  },
  { 
    q: "Wie funktioniert das Voting?", 
    a: "Jeder THESISDAO Token gibt dir ein Stimmrecht. Du kannst über verschiedene Proposals abstimmen, die von der Community eingereicht werden. Die Abstimmungen laufen für eine festgelegte Zeit und sind transparent auf der Blockchain einsehbar."
  },
  { 
    q: "Was passiert mit dem Treasury?", 
    a: "Das Treasury wird von der Community verwaltet. Alle Mitglieder können Vorschläge einreichen, wie die Mittel verwendet werden sollen – sei es für Entwicklung, Marketing oder andere Community-Projekte. Über die Verwendung wird demokratisch abgestimmt."
  },
  { 
    q: "Wie sicher ist das System?", 
    a: "Die DAO basiert auf der NEAR Blockchain, einer der sichersten und skalierbarsten Blockchains. Alle Transaktionen und Abstimmungen sind transparent und unveränderlich. Smart Contracts regeln die Logik und Sicherheit des Systems."
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Refs for scroll animations
  const aboutRef = useRef(null);
  const tokenomicsRef = useRef(null);
  const roadmapRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  // Scroll progress for each section
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: tokenomicsProgress } = useScroll({
    target: tokenomicsRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: roadmapProgress } = useScroll({
    target: roadmapRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: faqProgress } = useScroll({
    target: faqRef,
    offset: ["start end", "end start"]
  });
  const { scrollYProgress: contactProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end start"]
  });

  // Transform values for parallax effects
  const aboutY = useTransform(aboutProgress, [0, 1], [200, -200]);
  const tokenomicsY = useTransform(tokenomicsProgress, [0, 1], [200, -200]);
  const roadmapY = useTransform(roadmapProgress, [0, 1], [200, -200]);
  const faqY = useTransform(faqProgress, [0, 1], [200, -200]);
  const contactY = useTransform(contactProgress, [0, 1], [200, -200]);

  // Additional transform values for enhanced animations
  const aboutScale = useTransform(aboutProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const tokenomicsScale = useTransform(tokenomicsProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const roadmapScale = useTransform(roadmapProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const faqScale = useTransform(faqProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const contactScale = useTransform(contactProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Opacity transforms for fade effects
  const aboutOpacity = useTransform(aboutProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const tokenomicsOpacity = useTransform(tokenomicsProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const roadmapOpacity = useTransform(roadmapProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const faqOpacity = useTransform(faqProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const contactOpacity = useTransform(contactProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const [openFaq, setOpenFaq] = useState(null);
  const [showTop, setShowTop] = useState(false);

  // 1. Parallax für Orbs
  const [scrollYValue, setScrollYValue] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollYValue(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { selector } = await initWalletSelector();
        const state = selector.store.getState();
        const accounts = state.accounts;
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
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Token Sale State
  const HARDCAP = 10000000; // 10 Millionen Token
  const [tokenSale, setTokenSale] = useState({
    totalSupply: null,
    symbol: null,
    decimals: 24,
    loading: true,
  });

  useEffect(() => {
    const fetchTokenSale = async () => {
      try {
        const contractId = "dao.lioneluser.testnet"; // ggf. anpassen
        const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org");
        const fetchView = async (method, args = {}) => {
          const res = await provider.query({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
            finality: "final",
          });
          const raw = res?.result;
          if (!raw) return null;
          const decoded = new TextDecoder().decode(new Uint8Array(raw));
          return JSON.parse(decoded);
        };
        const meta = await fetchView("ft_metadata");
        const totalSupply = await fetchView("ft_total_supply");
        setTokenSale({
          totalSupply,
          symbol: meta?.symbol || "TOKEN",
          decimals: meta?.decimals || 24,
          loading: false,
        });
      } catch (err) {
        setTokenSale((prev) => ({ ...prev, loading: false }));
        console.error("Fehler beim Laden des Token Sale Stands:", err);
      }
    };
    fetchTokenSale();
  }, []);

  const formatAmount = (amount) => {
    if (!tokenSale.decimals || !amount) return "0.00";
    return (parseFloat(amount) / Math.pow(10, tokenSale.decimals)).toLocaleString();
  };
  const percent = tokenSale.totalSupply ? Math.min(100, (parseFloat(tokenSale.totalSupply) / (HARDCAP * Math.pow(10, tokenSale.decimals))) * 100) : 0;

  return (
    <div className="w-screen bg-gradient-to-br from-[#F5F7FB] via-white to-[#F5F7FB] text-black overflow-x-hidden scroll-smooth min-h-screen">
      <Header connectWallet={connectWallet} />

      {/* Smooth Scroll Progress Bar */}
      <motion.div 
        style={{ scaleX }} 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-accent origin-left z-50"
      />

      {/* Background Graphics with Parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F7FB] via-white to-[#F5F7FB]" />
        <motion.div 
          className="absolute top-10 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
        />
        <motion.div 
          className="absolute bottom-left w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-1">
        {/* Hero Section */}
        <motion.section 
          className="w-full min-h-[90vh] flex justify-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-16 px-4 sm:px-8 py-20">
            {/* Left: Text-Content */}
            <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-8 z-10 md:pl-8">
              <motion.h1 
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: '100% 50%' }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent drop-shadow-lg"
                style={{ backgroundSize: '200% 200%' }}
              >
                Thesis DAO
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 max-w-xl"
              >
                Demokratisch. Transparent. Community Driven. Built on NEAR.
              </motion.p>
              {/* Token Sale Progress */}
              <div className="w-full max-w-xs md:max-w-sm flex flex-col items-center my-2">
                {tokenSale.loading ? (
                  <div className="text-gray-400 text-sm flex items-center gap-2"><FaGem className="text-accent animate-pulse" /> Token Sale wird geladen...</div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <FaGem className="text-accent text-lg" />
                      <span className="text-sm text-gray-700 font-medium">Token Sale:</span>
                      <span className="text-sm font-bold text-primary">{formatAmount(tokenSale.totalSupply)} / {HARDCAP.toLocaleString()} {tokenSale.symbol}</span>
                      <span className="text-xs text-gray-500">({percent.toFixed(2)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-primary via-blue-500 to-accent rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                    </div>
                  </>
                )}
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="text-base text-gray-500 max-w-xl italic"
              >
                Ein Prototyp im Rahmen einer Bachelor Thesis an der ZHAW
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start mt-6 mb-2">
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: "0 0 32px 8px #6B46C1" }}
                  whileTap={{ scale: 0.96 }}
                  className="modern-button bg-blue-600 text-white px-8 py-4 rounded-xl shadow-xl text-lg font-semibold hover:bg-blue-700 transition duration-300 transform"
                  onClick={connectWallet}
                >
                  Wallet verbinden & starten
                </motion.button>
                <motion.a
                  href="#about"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 16px 2px #6B46C1" }}
                  whileTap={{ scale: 0.97 }}
                  className="modern-button border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl shadow-md text-lg font-semibold bg-white/80 hover:bg-blue-50 transition duration-300 transform"
                >
                  Mehr erfahren
                </motion.a>
              </div>
            </div>
            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="flex-1 flex justify-center items-center w-full md:w-auto mt-10 md:mt-0"
            >
              {/* Modernes Banking-Visual: Icon-Grid mit Glow/Parallax */}
              <div className="grid grid-cols-2 gap-6 p-8 rounded-3xl bg-white/60 backdrop-blur-md shadow-2xl max-w-xs mx-auto">
                <div className="flex flex-col items-center">
                  <FaWallet className="text-4xl text-primary drop-shadow-lg mb-2 animate-float" />
                  <span className="text-xs text-gray-600">Wallet</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaGem className="text-4xl text-accent drop-shadow-lg mb-2 animate-float-delay" />
                  <span className="text-xs text-gray-600">Token</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaChartLine className="text-4xl text-blue-500 drop-shadow-lg mb-2 animate-float" />
                  <span className="text-xs text-gray-600">Dashboard</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaUsers className="text-4xl text-primary drop-shadow-lg mb-2 animate-float-delay" />
                  <span className="text-xs text-gray-600">Community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* About Section with Parallax */}
        <motion.section 
          id="about"
          ref={aboutRef}
          style={{ y: aboutY, scale: aboutScale, opacity: aboutOpacity }}
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center space-y-12 relative scroll-mt-32"
        >
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-6"
          >
            Was ist diese DAO?
          </motion.h2>
          <motion.p 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6"
          >
            Eine DAO (Decentralized Autonomous Organization) ist eine digitale Organisation, die von ihren Mitgliedern gemeinschaftlich gesteuert wird. Entscheidungen werden transparent und demokratisch getroffen – ohne zentrale Instanz. <br /><br />
            Mit dem Kauf von Tokens wirst du Teil der DAO und erhältst die gleichen Rechte wie ein Aktionär einer traditionellen AG – oder sogar noch mehr: Du kannst mitbestimmen, Vorschläge einbringen und direkt an der Entwicklung und Verwaltung der Organisation teilnehmen.
          </motion.p>
          <motion.p 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Diese DAO wurde als Prototyp im Rahmen einer Bachelor Thesis an der ZHAW entwickelt, um die praktische Umsetzung und Anwendbarkeit von DAOs in der modernen Organisationsgestaltung zu erforschen.
          </motion.p>
          {/* Feature-Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-10 rounded-3xl bg-white/60 backdrop-blur-md shadow-2xl">
              {/* Mitbestimmen */}
              <div className="flex flex-col items-center text-center">
                <FaVoteYea className="text-4xl text-primary drop-shadow-lg mb-3" />
                <span className="text-lg font-semibold text-primary mb-1">Mitbestimmen</span>
                <span className="text-gray-600 text-base">Stimme über Vorschläge ab und gestalte die Zukunft aktiv mit.</span>
              </div>
              {/* Transparenz */}
              <div className="flex flex-col items-center text-center">
                <FaEye className="text-4xl text-blue-500 drop-shadow-lg mb-3" />
                <span className="text-lg font-semibold text-blue-500 mb-1">Transparenz</span>
                <span className="text-gray-600 text-base">Alle Entscheidungen und Transaktionen sind on-chain und nachvollziehbar.</span>
              </div>
              {/* Token-Belohnungen */}
              <div className="flex flex-col items-center text-center">
                <FaGem className="text-4xl text-primary drop-shadow-lg mb-3" />
                <span className="text-lg font-semibold text-primary mb-1">Token-Belohnungen</span>
                <span className="text-gray-600 text-base">Verdiene und nutze DAO-Token für Stimmrechte und Vorteile.</span>
              </div>
              {/* Community Treasury */}
              <div className="flex flex-col items-center text-center">
                <FaWallet className="text-4xl text-primary drop-shadow-lg mb-3" />
                <span className="text-lg font-semibold text-primary mb-1">Community Treasury</span>
                <span className="text-gray-600 text-base">Gemeinsame Verwaltung und Nutzung der Mittel durch die Community.</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dashboard Section with Parallax */}
        <motion.section
          id="dashboard"
          style={{ y: tokenomicsY, scale: tokenomicsScale, opacity: tokenomicsOpacity }}
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center relative overflow-hidden scroll-mt-32"
        >
          <motion.h2
            className="text-4xl font-bold text-primary mb-16 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Das DAO Dashboard
          </motion.h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Das Dashboard bietet dir einen schnellen Überblick über alle wichtigen DAO-Funktionen und deine persönlichen Aktivitäten.
          </p>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            {/* Example Screenshot Item 1 */}
            <motion.div
              className="glass-effect-neobank p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center bg-white/60 backdrop-blur-md border border-blue-100 hover:shadow-blue-200 transition-all group"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(80, 112, 255, 0.18)", filter: "brightness(1.05) blur(0.5px)" }}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 bg-gradient-to-br from-primary via-blue-400 to-accent shadow-lg group-hover:shadow-2xl transition-all">
                <FaChartLine className="text-4xl text-white drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1c5b] mb-3">Übersicht</h3>
              <p className="text-gray-600 text-base">Erhalte einen schnellen Überblick über deine Rolle, Token-Balance und aktive Proposals.</p>
            </motion.div>
            {/* Example Screenshot Item 2 */}
            <motion.div
              className="glass-effect-neobank p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center bg-white/60 backdrop-blur-md border border-blue-100 hover:shadow-blue-200 transition-all group"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(80, 112, 255, 0.18)", filter: "brightness(1.05) blur(0.5px)" }}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 bg-gradient-to-br from-primary via-blue-400 to-accent shadow-lg group-hover:shadow-2xl transition-all">
                <FaVoteYea className="text-4xl text-white drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1c5b] mb-3">Proposals</h3>
              <p className="text-gray-600 text-base">Sieh dir aktive Proposals an, stimme ab oder erstelle neue Vorschläge für die Community.</p>
            </motion.div>
            {/* Example Screenshot Item 3 */}
            <motion.div
              className="glass-effect-neobank p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center bg-white/60 backdrop-blur-md border border-blue-100 hover:shadow-blue-200 transition-all group"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(80, 112, 255, 0.18)", filter: "brightness(1.05) blur(0.5px)" }}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 bg-gradient-to-br from-primary via-blue-400 to-accent shadow-lg group-hover:shadow-2xl transition-all">
                <FaGem className="text-4xl text-white drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1c5b] mb-3">Token Management</h3>
              <p className="text-gray-600 text-base">Verwalte deine THESISDAO Tokens und verfolge den Fortschritt des Token Sales.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Tokenomics Section with Parallax */}
        <motion.section 
          id="tokenomics"
          ref={tokenomicsRef}
          style={{ y: tokenomicsY, scale: tokenomicsScale, opacity: tokenomicsOpacity }}
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center relative overflow-hidden scroll-mt-32"
        >
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-16 relative z-10"
          >
            Tokenomics
          </motion.h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Hier erfährst du, wie die Token im Ökosystem verteilt sind und welche Rolle sie für die Community spielen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl mx-auto relative z-10">
            {[
              { icon: <FaExchangeAlt />, title: "Umlauf", desc: "60% Community-basiert", value: "60%" },
              { icon: <FaTools />, title: "Treasury", desc: "30% für Entwicklung & Finanzierung", value: "30%" },
              { icon: <FaUsers />, title: "Team", desc: "10% für Core-Contributors", value: "10%" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: i * 0.15 + 0.2, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.04,
                  boxShadow: "0 8px 32px 0 rgba(80, 112, 255, 0.18)",
                  filter: "brightness(1.05) blur(0.5px)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="glass-effect-neobank p-10 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center text-center backdrop-blur-md bg-white/60 hover:bg-white/80 transition-all group relative overflow-hidden"
              >
                {/* Glow/Gradient Icon */}
                <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 bg-gradient-to-br from-primary via-blue-400 to-accent shadow-lg group-hover:shadow-2xl transition-all">
                  <span className="text-4xl text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px #6B46C1)' }}>{item.icon}</span>
                </div>
                {/* Große Zahl/Titel */}
                <div className="text-5xl font-extrabold text-primary mb-2 tracking-tight group-hover:text-accent transition-colors">{item.value}</div>
                <h3 className="text-2xl font-semibold text-[#2c1c5b] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-lg font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Roadmap Section with Parallax */}
        <motion.section 
          id="roadmap"
          ref={roadmapRef}
          style={{ y: roadmapY, scale: roadmapScale, opacity: roadmapOpacity }}
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center relative scroll-mt-32"
        >
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-20 relative z-10"
          >
            Roadmap
          </motion.h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Unsere Roadmap zeigt dir die wichtigsten Meilensteine und die geplante Entwicklung der DAO.
          </p>
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-row justify-between items-end w-full gap-2">
              {[
                { q: "Q3 2025", title: "DAO & Website Launch", icon: <FaRocket />, highlight: true },
                { q: "Q4 2025", title: "Protocol Improvements", icon: <FaUsers />, highlight: false },
                { q: "Q1 2026", title: "Token Unlock & Distribution", icon: <FaGem />, highlight: false },
                { q: "Q2 2026", title: "Strategic Partnerships", icon: <FaHandshake />, highlight: false },
                { q: "Q3 2026", title: "Ecosystem Expansion", icon: <FaChartLine />, highlight: false }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center w-40 max-w-[20vw] min-w-0">
                  <motion.div
                    initial={{ scale: 0.8, boxShadow: '0 0 0px 0px #6B46C1' }}
                    whileInView={{ scale: item.highlight ? 1.25 : 1, boxShadow: item.highlight ? '0 0 48px 12px #00e6fb, 0 0 0 8px #fff4' : '0 0 24px 6px #6B46C1' }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 48px 12px #00e6fb, 0 0 0 8px #fff4' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`flex items-center justify-center w-16 h-16 rounded-full bg-white/60 backdrop-blur-md border-4 border-white shadow-lg mb-2 ${item.highlight ? 'bg-gradient-to-br from-accent to-blue-400' : ''}`}
                  >
                    <span className={`text-3xl ${item.highlight ? 'text-white animate-spin-slow' : 'text-primary'}`}>{item.icon}</span>
                  </motion.div>
                  <span className={`text-xs sm:text-sm font-semibold mb-1 px-2 sm:px-3 py-1 rounded-full bg-white/70 backdrop-blur-md shadow text-primary ${item.highlight ? 'bg-gradient-to-r from-accent to-blue-400 text-transparent bg-clip-text font-extrabold' : ''} transition-colors`}>{item.q}</span>
                  <span className={`block text-base sm:text-lg md:text-xl font-bold px-0 py-2 ${item.highlight ? 'bg-gradient-to-r from-accent to-blue-400 text-transparent bg-clip-text font-extrabold' : 'text-[#2c1c5b]'} transition-colors break-words text-center w-full`}>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section with Parallax */}
        <motion.section 
          id="faq"
          ref={faqRef}
          style={{ y: faqY, scale: faqScale, opacity: faqOpacity }}
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center relative overflow-hidden scroll-mt-32"
        >
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-10 relative"
          >
            Häufige Fragen
          </motion.h2>
          <div className="w-full max-w-5xl mx-auto text-left space-y-4 relative">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: i * 0.15 + 0.2, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 8px 32px rgba(80,112,255,0.15)",
                  filter: "brightness(1.04) blur(0.5px)",
                  transition: { duration: 0.2 }
                }}
                className={`w-full border border-blue-100 rounded-xl overflow-hidden bg-white/80 backdrop-blur-md group transition-all shadow-lg hover:shadow-xl ${openFaq === i ? '' : 'min-h-16'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 font-semibold text-gray-800 flex justify-between items-center text-base hover:bg-blue-50/50 transition-colors"
                >
                  <span className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3 text-sm font-bold">
                      {i + 1}
                    </span>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-primary text-xl group-hover:scale-110 transition-transform"
                  >
                    {openFaq === i ? <FaMinus /> : <FaPlus />}
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full overflow-hidden bg-gradient-to-br from-blue-50/50 to-white/50"
                    >
                      <div className="px-6 py-4 text-gray-700 text-base leading-relaxed w-full">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section with Parallax */}
        <motion.section 
          id="contact"
          ref={contactRef}
          style={{ y: contactY, scale: contactScale, opacity: contactOpacity }}
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center relative overflow-hidden scroll-mt-32"
        >
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-6"
          >
            Kontakt
          </motion.h2>
          <motion.p 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 mb-12"
          >
            Hast du Fragen oder möchtest mehr über unser Projekt erfahren? Wir freuen uns auf deine Nachricht!
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 8px 32px rgba(80,112,255,0.15)",
                filter: "brightness(1.04) blur(0.5px)",
                transition: { duration: 0.2 }
              }}
              className="glass-effect-neobank p-8 rounded-2xl hover:shadow-2xl transition-all bg-white/70 backdrop-blur-md border border-blue-100"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-blue-400 to-accent flex items-center justify-center shadow-lg">
                <FaEnvelope className="text-white text-2xl drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Email</h3>
              <a 
                href="mailto:murbalio@students.zhaw.ch" 
                className="text-gray-600 hover:text-accent transition-colors duration-300 inline-block"
              >
                murbalio@students.zhaw.ch
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 8px 32px rgba(80,112,255,0.15)",
                filter: "brightness(1.04) blur(0.5px)",
                transition: { duration: 0.2 }
              }}
              className="glass-effect-neobank p-8 rounded-2xl hover:shadow-2xl transition-all bg-white/70 backdrop-blur-md border border-blue-100"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-blue-400 to-accent flex items-center justify-center shadow-lg">
                <FaDiscord className="text-white text-2xl drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Discord</h3>
              <p className="text-gray-600">Coming Soon</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 8px 32px rgba(80,112,255,0.15)",
                filter: "brightness(1.04) blur(0.5px)",
                transition: { duration: 0.2 }
              }}
              className="glass-effect-neobank p-8 rounded-2xl hover:shadow-2xl transition-all bg-white/70 backdrop-blur-md border border-blue-100"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-blue-400 to-accent flex items-center justify-center shadow-lg">
                <FaTwitter className="text-white text-2xl drop-shadow-lg" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Twitter</h3>
              <p className="text-gray-600">Coming Soon</p>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="min-h-[70vh] flex flex-col justify-center px-6 text-center relative overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="max-w-3xl mx-auto relative"
          >
            <motion.h2 
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="text-4xl font-bold text-primary mb-6"
            >
              Bereit mitzumachen?
            </motion.h2>
            <motion.p 
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="text-xl text-gray-600 mb-8"
            >
              Werde Teil unserer Community. Diskutiere, vote, entwickle, verwalte.
            </motion.p>
            <motion.button
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(107, 70, 193, 0.4)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              onClick={connectWallet}
              className="modern-button bg-blue-600 text-white px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Jetzt Wallet verbinden
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ 
                scale: 1.2,
                boxShadow: "0 0 20px rgba(107, 70, 193, 0.3)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 z-50 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:brightness-110 text-lg"
            >
              ↑ Top
            </motion.button>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="py-12 px-6 bg-white text-center text-sm text-gray-500 border-t border-gray-200">
          <p className="text-lg">
            © {new Date().getFullYear()} Thesis DAO – Built on{" "}
            <span className="text-primary font-medium">NEAR Protocol</span>
          </p>
        </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;