import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { AnimatePresence, motion } from "framer-motion";
import { IconClose, LogoMark } from "./icons";

const navLinks = [
  { to: "about", label: "Über uns" },
  { to: "tokenomics", label: "Tokenomics" },
  { to: "roadmap", label: "Roadmap" },
  { to: "faq", label: "FAQ" },
  { to: "contact", label: "Kontakt" },
];

/* Anchors land just under the 64px bar. */
const SCROLL_OFFSET = -64;

const Header = ({ connectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
          scrolled
            ? "border-edge bg-surface-0/80 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 sm:px-8">
          <Link
            to="hero"
            smooth
            duration={500}
            offset={SCROLL_OFFSET}
            className="flex cursor-pointer items-center gap-2.5 select-none"
            aria-label="Zum Seitenanfang"
          >
            <LogoMark size={20} />
            <span className="whitespace-nowrap text-[0.9375rem] font-medium tracking-[-0.02em] text-fg">
              Thesis DAO
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={500}
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
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapper owns the breakpoint — .lp-btn sets its own display. */}
            <div className="hidden sm:block">
              <button
                onClick={connectWallet}
                className="lp-btn lp-btn--primary lp-btn--sm"
              >
                Wallet verbinden
              </button>
            </div>

            <button
              className="-mr-2 flex h-9 w-9 items-center justify-center text-fg-muted transition-colors hover:text-fg md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={menuOpen}
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-[18px] bg-current" />
                <span className="block h-px w-[18px] bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-surface-0 md:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-edge px-5">
                <div className="flex items-center gap-2.5">
                  <LogoMark size={20} />
                  <span className="text-[0.9375rem] font-medium tracking-[-0.02em] text-fg">
                    Thesis DAO
                  </span>
                </div>
                <button
                  className="-mr-2 flex h-9 w-9 items-center justify-center text-fg-muted transition-colors hover:text-fg"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Menü schliessen"
                >
                  <IconClose size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    smooth
                    duration={500}
                    offset={SCROLL_OFFSET}
                    onClick={() => setMenuOpen(false)}
                    className="flex cursor-pointer items-center justify-between border-b border-edge px-5 py-5"
                  >
                    <span className="text-[1.375rem] font-medium tracking-[-0.03em] text-fg">
                      {link.label}
                    </span>
                    <span className="lp-mono text-[0.6875rem] text-fg-faint">
                      0{i + 1}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="shrink-0 border-t border-edge p-5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    connectWallet();
                  }}
                  className="lp-btn lp-btn--primary !flex w-full"
                >
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
