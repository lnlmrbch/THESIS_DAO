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
    <div className="w-screen bg-[#F5F7FB] text-black overflow-x-hidden scroll-smooth">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50" />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-screen flex flex-col justify-center items-center text-center px-4 space-y-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary">
          Lionel Thesis DAO
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          Demokratisch. Transparent. Community Driven. Built on NEAR.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={connectWallet}
          className="px-8 py-3 bg-accent text-black font-semibold rounded-md transition text-lg"
        >
          Wallet verbinden & starten 🚀
        </motion.button>
        <Link
          to="about"
          smooth
          duration={600}
          className="text-primary underline mt-4 text-sm cursor-pointer hover:text-black"
        >
          Mehr erfahren ↓
        </Link>
      </motion.section>

      {/* About */}
      <section id="about" className="py-20 px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold text-primary">Was ist diese DAO?</h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          Eine digitale Organisation, bei der du als Token-Holder mitbestimmen kannst.
          Vorschläge einreichen, abstimmen, Treasury verwalten. Vollkommen dezentral.
        </p>
      </section>

      {/* Tokenomics */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-primary mb-12">Tokenomics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            ["🔁 Umlauf", "60% Community-basiert"],
            ["🛠 Treasury", "30% für Entwicklung & Finanzierung"],
            ["👨‍💻 Team", "10% für Core-Contributors"],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-[#f9fafb] p-6 rounded-lg border border-gray-200 transition"
            >
              <h3 className="text-xl font-semibold text-[#2c1c5b] mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">Roadmap</h2>
        <ol className="space-y-6 max-w-4xl mx-auto text-left text-gray-700">
          <li className="border-l-4 border-green-400 pl-6"><strong>✅ Q1:</strong> DAO online & Proposal System live</li>
          <li className="border-l-4 border-yellow-400 pl-6"><strong>🛠 Q2:</strong> Token Launch, Voting live</li>
          <li className="border-l-4 border-blue-400 pl-6"><strong>📢 Q3:</strong> Community Events, Staking</li>
          <li className="border-l-4 border-gray-400 pl-6"><strong>🚀 Q4:</strong> Grants, Incentives, Expansion</li>
        </ol>
        <a
          href="https://github.com/users/lnlmrbch/projects/2"
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-sm text-primary underline hover:text-black"
        >
          → Vollständige GitHub-Roadmap ansehen
        </a>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">Häufige Fragen</h2>
        <div className="max-w-3xl mx-auto text-left space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 font-semibold text-black flex justify-between items-center"
              >
                {faq.q}
                <span>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <div className="px-6 pb-4 text-gray-600">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-[#F5F7FB]">
        <h2 className="text-3xl font-bold text-primary mb-4">Bereit mitzumachen?</h2>
        <p className="text-gray-600 mb-6">
          Werde Teil unserer Community. Diskutiere, vote, entwickle, verwalte.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          className="px-8 py-3 bg-accent text-black font-bold rounded-md transition text-lg"
        >
          Jetzt Wallet verbinden
        </motion.button>
      </section>

      {/* Scroll to Top */}
      {showTop && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:brightness-110"
        >
          ↑ Top
        </motion.button>
      )}

      {/* Footer */}
      <footer className="py-10 px-6 bg-white text-center text-sm text-gray-500 border-t border-gray-200">
        <p>
          © {new Date().getFullYear()} Thesis DAO – Built on{" "}
          <span className="text-primary font-medium">NEAR Protocol</span>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;