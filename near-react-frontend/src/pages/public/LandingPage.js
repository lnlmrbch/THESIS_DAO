import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { initWalletSelector } from "../../wallet";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import Header from "../public/Header";
import { FaRocket, FaGem, FaExchangeAlt, FaTools, FaUsers, FaChartLine, FaCheck, FaWrench, FaBullhorn, FaRocket as FaRocket2, FaChevronDown, FaPlus, FaMinus, FaHandshake, FaVoteYea, FaArrowRight, FaEnvelope, FaDiscord, FaTwitter } from "react-icons/fa";

const faqs = [
  { q: "Was ist eine DAO?", a: "DAO = dezentrale autonome Organisation. Du entscheidest mit – ohne Mittelsmann." },
  { q: "Wie kann ich mitmachen?", a: "Wallet verbinden, Token holen, Proposals abstimmen oder selbst erstellen." },
  { q: "Was kostet es?", a: "Nur etwas NEAR für die Transaktionen. Keine versteckten Gebühren." },
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

  // InView states
  const aboutInView = useInView(aboutRef, { margin: "-100px" });
  const tokenomicsInView = useInView(tokenomicsRef, { margin: "-100px" });
  const roadmapInView = useInView(roadmapRef, { margin: "-100px" });
  const faqInView = useInView(faqRef, { margin: "-100px" });
  const contactInView = useInView(contactRef, { margin: "-100px" });

  const [openFaq, setOpenFaq] = useState(null);
  const [showTop, setShowTop] = useState(false);

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

  return (
    <div className="w-screen bg-[#F5F7FB] text-black overflow-x-hidden scroll-smooth">
      <Header />

      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50" />

      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Gradient Orb 1 */}
        <motion.div 
          className="absolute top-10 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        {/* Subtle Gradient Orb 2 */}
        <motion.div 
          className="absolute bottom-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
         {/* Subtle Gradient Orb 3 */}
        <motion.div 
          className="absolute bottom-left w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
           animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
      </div>

      <div className="relative z-10">
      {/* Hero */}
      <motion.section 
        className="w-full h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 space-y-6 bg-gradient-to-br from-purple-100 via-white to-indigo-100 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NDY2ZjkiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-4 text-gray-800 drop-shadow-lg"
          >
            Thesis DAO
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Demokratisch. Transparent. Community Driven. Built on NEAR.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(107, 70, 193, 0.4)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            onClick={connectWallet}
            className="modern-button bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Wallet verbinden & starten
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(107, 70, 193, 0.4)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            href="#about"
            className="modern-button bg-transparent border border-blue-600 text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-105"
          >
            Mehr erfahren
          </motion.button>
        </motion.div>
      </motion.section>

      {/* About */}
      <motion.section 
        ref={aboutRef}
        initial={{ opacity: 0, y: 80 }}
        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        id="about" 
        className="py-32 px-6 text-center space-y-8 relative"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NDY2ZjkiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto relative"
        >
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            animate={aboutInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-6"
          >
            Was ist diese DAO?
          </motion.h2>
          <motion.p 
            initial={{ y: 40, opacity: 0 }}
            animate={aboutInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-xl text-gray-700 leading-relaxed"
          >
            Eine digitale Organisation, bei der du als Token-Holder mitbestimmen kannst.
            Vorschläge einreichen, abstimmen, Treasury verwalten. Vollkommen dezentral.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Dashboard Section */}
      <motion.section
        id="dashboard"
        className="py-32 px-6 text-center relative bg-dashboard-pattern overflow-hidden"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Example Screenshot Item 1 */}
          <motion.div
            className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
             viewport={{ once: true }}
             whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
          >
            <img src="/placeholder-dashboard-1.png" alt="Dashboard Screenshot 1" className="rounded-lg mb-4 w-full h-auto object-cover" />
            <h3 className="text-xl font-semibold text-[#2c1c5b] mb-3">Übersicht</h3>
            <p className="text-gray-600 text-base">Erhalte einen schnellen Überblick über deine Rolle, Token-Balance und aktive Proposals.</p>
          </motion.div>

          {/* Example Screenshot Item 2 */}
           <motion.div
            className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
             viewport={{ once: true }}
             whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
          >
            <img src="/placeholder-dashboard-2.png" alt="Dashboard Screenshot 2" className="rounded-lg mb-4 w-full h-auto object-cover" />
            <h3 className="text-xl font-semibold text-[#2c1c5b] mb-3">Proposals</h3>
            <p className="text-gray-600 text-base">Sieh dir aktive Proposals an, stimme ab oder erstelle neue Vorschläge für die Community.</p>
          </motion.div>

           {/* Example Screenshot Item 3 */}
           <motion.div
            className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
             viewport={{ once: true }}
             whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
          >
            <img src="/placeholder-dashboard-3.png" alt="Dashboard Screenshot 3" className="rounded-lg mb-4 w-full h-auto object-cover" />
            <h3 className="text-xl font-semibold text-[#2c1c5b] mb-3">Token Management</h3>
            <p className="text-gray-600 text-base">Verwalte deine THESISDAO Tokens und verfolge den Fortschritt des Token Sales.</p>
          </motion.div>
           {/* Add more screenshot items here if needed */}
        </div>

      </motion.section>

      {/* Tokenomics */}
      <motion.section 
        ref={tokenomicsRef}
        initial={{ opacity: 0, y: 80 }}
        animate={tokenomicsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-32 px-6 bg-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NDY2ZjkiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <motion.h2 
          initial={{ y: 40, opacity: 0 }}
          animate={tokenomicsInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl font-bold text-primary mb-16 relative"
        >
          Tokenomics
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {[
            { icon: <FaExchangeAlt />, title: "Umlauf", desc: "60% Community-basiert" },
            { icon: <FaTools />, title: "Treasury", desc: "30% für Entwicklung & Finanzierung" },
            { icon: <FaUsers />, title: "Team", desc: "10% für Core-Contributors" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={tokenomicsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: i * 0.15 + 0.2, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(107, 70, 193, 0.1)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="bg-[#f9fafb] p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={tokenomicsInView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.3, ease: "easeOut" }}
                className="text-4xl mb-4 group-hover:scale-110 transition-transform text-primary"
              >
                {item.icon}
              </motion.div>
              <h3 className="text-2xl font-semibold text-[#2c1c5b] mb-4">{item.title}</h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Roadmap */}
      <motion.section 
        ref={roadmapRef}
        initial={{ opacity: 0, y: 80 }}
        animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="roadmap" 
        className="py-32 px-6 text-center relative"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NDY2ZjkiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <motion.h2 
          initial={{ y: 40, opacity: 0 }}
          animate={roadmapInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl font-bold text-primary mb-16 relative"
        >
          Roadmap
        </motion.h2>
        <ol className="space-y-8 max-w-4xl mx-auto text-left text-gray-700 relative">
          {[
            { icon: <FaCheck />, text: "DAO online & Proposal System live", status: "Q1:", border: "border-green-400" },
            { icon: <FaWrench />, text: "Token Launch, Voting live", status: "Q2:", border: "border-yellow-400" },
            { icon: <FaBullhorn />, text: "Community Events, Staking", status: "Q3:", border: "border-blue-400" },
            { icon: <FaChartLine />, text: "Grants, Incentives, Expansion", status: "Q4:", border: "border-gray-400" }
          ].map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -60, scale: 0.95 }}
              animate={roadmapInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: i * 0.15 + 0.2, ease: "easeOut" }}
              whileHover={{ 
                x: 15,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className={`border-l-4 ${item.border} pl-8 py-4 bg-white rounded-r-xl shadow-sm group`}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={roadmapInView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.3, ease: "easeOut" }}
                className="flex items-center"
              >
                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform text-primary">{item.icon}</span>
                <div>
                  <strong className="text-lg text-primary">{item.status}</strong>
                  <span className="text-lg ml-2">{item.text}</span>
                </div>
              </motion.div>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      {/* FAQ */}
      <motion.section 
        ref={faqRef}
        initial={{ opacity: 0, y: 80 }}
        animate={faqInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="faq"
        className="py-32 px-6 bg-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NDY2ZjkiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <motion.h2 
          initial={{ y: 40, opacity: 0 }}
          animate={faqInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl font-bold text-primary mb-16 relative"
        >
          Häufige Fragen
        </motion.h2>
        <div className="max-w-3xl mx-auto text-left space-y-6 relative">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={faqInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: i * 0.15 + 0.2, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(107, 70, 193, 0.1)",
                transition: { duration: 0.2 }
              }}
              className="border border-gray-200 rounded-xl overflow-hidden bg-[#f9fafb] group"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-8 py-6 font-semibold text-gray-800 flex justify-between items-center text-lg"
              >
                {faq.q}
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-primary text-2xl group-hover:scale-110 transition-transform"
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
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-700 text-lg">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section 
        ref={contactRef}
        initial={{ opacity: 0, y: 80 }}
        animate={contactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="contact"
        className="py-32 px-6 bg-white text-center relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ y: 40, opacity: 0 }}
            animate={contactInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-primary mb-16 relative"
          >
            Kontakt
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></div>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-left"
            >
              <h3 className="text-2xl font-semibold text-primary mb-4">Kontaktiere uns</h3>
              <p className="text-gray-600 mb-6">
                Hast du Fragen oder möchtest mehr über unser Projekt erfahren? Wir freuen uns auf deine Nachricht!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaEnvelope className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:contact@thesisdao.com" className="text-primary hover:text-accent transition">
                      contact@thesisdao.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaDiscord className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discord</p>
                    <a href="https://discord.gg/thesisdao" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition">
                      Join our Discord
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaTwitter className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Twitter</p>
                    <a href="https://twitter.com/thesisdao" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition">
                      @thesisdao
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-[#f9fafb] p-8 rounded-2xl border border-gray-200"
            >
              <h3 className="text-2xl font-semibold text-primary mb-6">Newsletter</h3>
              <p className="text-gray-600 mb-6">
                Bleibe auf dem Laufenden über unsere neuesten Entwicklungen und Updates.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Deine Email Adresse"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
                <button
                  type="submit"
                  className="w-full modern-button bg-primary text-white py-3 rounded-lg hover:bg-accent transition duration-300"
                >
                  Abonnieren
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-32 px-6 text-center bg-gradient-to-r from-violet-50 to-indigo-100 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiM2NDY2ZjkiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
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
  );
};

export default LandingPage;