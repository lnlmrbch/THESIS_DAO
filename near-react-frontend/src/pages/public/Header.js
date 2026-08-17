import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { AnimatePresence, motion } from "framer-motion";
import { IconWallet, IconClose, LogoMark } from "./icons";

const navLinks = [
  { to: "about", label: "Über uns" },
  { to: "tokenomics", label: "Tokenomics" },
  { to: "roadmap", label: "Roadmap" },
  { to: "faq", label: "FAQ" },
  { to: "contact", label: "Kontakt" },
];

/* Anchors land just below the floating bar instead of underneath it. */
const SCROLL_OFFSET = -96;

const Header = ({ connectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll while the mobile sheet is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={`mx-auto flex max-w-content items-center justify-between rounded-2xl border transition-all duration-500 ${
            condensed
              ? "mt-3 border-white/10 bg-ink-950/80 px-4 py-2.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-5"
              : "mt-5 border-transparent bg-transparent px-4 py-3.5 sm:px-5"
          }`}
        >
          {/* Wordmark */}
          <Link
            to="hero"
            smooth
            duration={600}
            offset={SCROLL_OFFSET}
            className="flex cursor-pointer items-center gap-2.5 select-none"
            aria-label="Zum Seitenanfang"
          >
            <LogoMark size={26} />
            <span className="whitespace-nowrap font-display text-[1.0625rem] font-semibold tracking-tight text-white">
              Thesis DAO
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-8 text-[0.9375rem] md:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  smooth
                  duration={600}
                  offset={SCROLL_OFFSET}
                  spy
                  onSetActive={() => setActive(link.to)}
                  onSetInactive={() =>
                    setActive((cur) => (cur === link.to ? null : cur))
                  }
                  className={`lp-navlink cursor-pointer ${
                    active === link.to ? "is-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Wrapper owns the breakpoint — .lp-btn sets its own display,
                so a `hidden` utility on the button itself would lose. */}
            <div className="hidden sm:block">
              <button
                onClick={connectWallet}
                className="lp-btn lp-btn--primary lp-btn--sm"
              >
                <IconWallet size={16} />
                Wallet verbinden
              </button>
            </div>

            {/* Mobile trigger */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={menuOpen}
            >
              <span className="flex flex-col items-center justify-center gap-[5px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <LogoMark size={26} />
                  <span className="font-display text-[1.0625rem] font-semibold text-white">
                    Thesis DAO
                  </span>
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Menü schliessen"
                >
                  <IconClose size={18} />
                </button>
              </div>

              <nav className="mt-14 flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 + i * 0.055,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      to={link.to}
                      smooth
                      duration={600}
                      offset={SCROLL_OFFSET}
                      onClick={() => setMenuOpen(false)}
                      className="flex cursor-pointer items-baseline gap-4 border-b border-white/[0.07] py-5"
                    >
                      <span className="lp-mono text-[0.6875rem] text-white/30">
                        0{i + 1}
                      </span>
                      <span className="font-display text-3xl font-medium tracking-tight text-white">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    connectWallet();
                  }}
                  className="lp-btn lp-btn--primary !flex w-full"
                >
                  <IconWallet size={17} />
                  Wallet verbinden
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
