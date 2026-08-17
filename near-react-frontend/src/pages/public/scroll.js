import { useEffect, useState } from "react";

/**
 * Native smooth scrolling to a section.
 *
 * react-scroll caches the target's offset when the animation starts and does
 * not re-check it, which made repeat clicks on the same link land up to ~120px
 * short. scrollIntoView hands the job to the browser, which retargets if the
 * layout moves, and it honours the `scroll-mt-*` utility already on each
 * section instead of needing a hand-tuned pixel offset.
 */
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * Reports which section currently owns the viewport, for the nav's active
 * state. Uses a band just under the header so a section counts as active once
 * its top edge crosses it.
 */
export const useActiveSection = (ids) => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
};
