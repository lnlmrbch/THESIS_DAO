import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initWalletSelector } from "../wallet";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-scroll";

const faqs = [
  { q: "Was ist eine DAO?", a: "DAO = dezentrale autonome Organisation. Du entscheidest mit – ohne Mittelsmann." },
  { q: "Wie kann ich mitmachen?", a: "Wallet verbinden, Token holen, Proposals abstimmen oder selbst erstellen." },
  { q: "Was kostet es?", a: "Nur etwas NEAR für die Transaktionen. Keine versteckten Gebühren." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [openFaq, setOpenFaq] = useState(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { selector } = await initWalletSelector();
        const state = selector.store.getState();
        const accounts = state.accounts;
        if (accounts.length > 0) navigate("/dashboard");
      } catch (err) {
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
    <div className="w-screen bg-gradient-to-r from-gray-900 via-darkbg to-gray-900 text-white overflow-x-hidden scroll-smooth">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50" />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-screen flex flex-col justify-center items-center text-center px-4 space-y-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-accent drop-shadow-lg">
          Willkommen bei der DAO von Lionel - Bachelor Thesis
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          Demokratisch. Transparent. Community Driven – Built on NEAR.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={connectWallet}
          className="px-10 py-4 bg-gradient-to-r from-green-400 to-accent text-black font-bold rounded-full hover:brightness-110 transition text-xl"
        >
          Wallet verbinden & starten 🚀
        </motion.button>
        <Link
          to="about"
          smooth
          duration={600}
          className="text-accent underline mt-4 text-sm cursor-pointer hover:text-white"
        >
          Mehr erfahren ↓
        </Link>
      </motion.section>

      {/* About */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full py-20 text-center px-6"
      >
        <h2 className="text-4xl font-bold text-accent mb-6">Was ist diese DAO?</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Eine digitale Organisation, bei der du als Token-Holder mitbestimmen kannst. Vorschläge einreichen,
          abstimmen, Treasury verwalten. Vollkommen dezentral.
        </p>
      </motion.section>

      {/* Tokenomics */}
      <motion.section
        id="tokenomics"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-20 bg-gray-800 text-center px-6"
      >
        <h2 className="text-4xl font-bold text-accent mb-10">Tokenomics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto text-white">
          {[
            ["🔁 Umlauf", "60% Community-basiert"],
            ["🛠 Treasury", "30% für Entwicklung & Finanzierung"],
            ["👨‍💻 Team", "10% für Core-Contributors"]
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-2xl transition-all"
            >
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Roadmap */}
      <motion.section
        id="roadmap"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-20 text-center px-6"
      >
        <h2 className="text-4xl font-bold text-accent mb-10">Roadmap</h2>
        <ol className="space-y-6 max-w-4xl mx-auto text-left">
          <li className="border-l-4 border-green-400 pl-6"><span className="font-bold text-white">✅ Q1:</span> DAO online & Proposal System live</li>
          <li className="border-l-4 border-yellow-400 pl-6"><span className="font-bold text-white">🛠 Q2:</span> Token Launch, Voting live</li>
          <li className="border-l-4 border-blue-400 pl-6"><span className="font-bold text-white">📢 Q3:</span> Community Events, Staking</li>
          <li className="border-l-4 border-gray-500 pl-6"><span className="font-bold text-white">🚀 Q4:</span> Grants, Incentives, Expansion</li>
        </ol>
        <a
          href="https://github.com/users/lnlmrbch/projects/2"
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-sm text-accent underline hover:text-white"
        >
          → Vollständige GitHub-Roadmap ansehen
        </a>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="w-full py-20 bg-gray-900 text-center px-6"
      >
        <h2 className="text-4xl font-bold text-accent mb-10">Häufige Fragen</h2>
        <div className="max-w-3xl mx-auto text-left space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-700 rounded-lg">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 text-white font-semibold flex justify-between items-center"
              >
                {faq.q}
                <span>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <div className="px-6 pb-4 text-gray-400">{faq.a}</div>}
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="w-full py-20 bg-darkbg text-center px-6"
      >
        <h2 className="text-4xl font-bold text-accent mb-4">Bereit mitzumachen?</h2>
        <p className="text-gray-300 mb-6">
          Werde Teil unserer Community. Diskutiere, vote, entwickle, verwalte.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          className="px-8 py-3 bg-accent text-black font-bold rounded-full hover:brightness-110 transition text-lg"
        >
          Jetzt Wallet verbinden
        </motion.button>
      </motion.section>

      {/* Scroll to Top */}
      {showTop && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 bg-accent text-black px-4 py-2 rounded-full shadow-lg hover:brightness-110"
        >
          ↑ Top
        </motion.button>
      )}

      {/* Footer */}
      <footer className="w-full py-10 px-6 bg-cardbg text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Thesis DAO – Built on <span className="text-accent font-semibold">NEAR Protocol</span></p>
      </footer>
    </div>
  );
};

export default LandingPage;