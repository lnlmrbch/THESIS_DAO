import React from "react";

/**
 * Hand-rolled 24px stroke icon set for the landing page.
 * Consistent 1.5px stroke, round caps/joins — reads far cleaner than
 * mixed-weight icon-font glyphs at display sizes.
 */

const Svg = ({ children, size = 24, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
);

export const IconWallet = (p) => (
  <Svg {...p}>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a2 2 0 0 1 2 2v1" />
    <path d="M3 8.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5" />
    <path d="M21 9.5h-4a2.5 2.5 0 0 0 0 5h4Z" />
  </Svg>
);

export const IconToken = (p) => (
  <Svg {...p}>
    <path d="M12 2.75 20.5 8v8L12 21.25 3.5 16V8Z" />
    <path d="M12 7.5 16.5 10v4L12 16.5 7.5 14v-4Z" />
  </Svg>
);

export const IconChart = (p) => (
  <Svg {...p}>
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="m7.5 14.5 3.5-4 3 2.5 4.5-6" />
  </Svg>
);

export const IconUsers = (p) => (
  <Svg {...p}>
    <path d="M15.5 19v-1.5a3.5 3.5 0 0 0-3.5-3.5H7a3.5 3.5 0 0 0-3.5 3.5V19" />
    <circle cx="9.5" cy="8" r="3" />
    <path d="M20.5 19v-1.5a3.5 3.5 0 0 0-2.75-3.42" />
    <path d="M15.5 5.2a3 3 0 0 1 0 5.6" />
  </Svg>
);

export const IconVote = (p) => (
  <Svg {...p}>
    <path d="M6.5 10V5.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V10" />
    <path d="m9.75 7.4 1.6 1.6 3.15-3.2" />
    <rect x="3" y="13" width="18" height="6.5" rx="1.5" />
    <path d="M9.5 13v-1.5h5V13" />
  </Svg>
);

export const IconEye = (p) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.75" />
  </Svg>
);

export const IconVault = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v1.5M12 14.5V16M8 12h1.5M14.5 12H16" />
  </Svg>
);

export const IconExchange = (p) => (
  <Svg {...p}>
    <path d="M4 8.5h13l-3-3" />
    <path d="M20 15.5H7l3 3" />
  </Svg>
);

export const IconTools = (p) => (
  <Svg {...p}>
    <path d="M15.6 4.6a3.6 3.6 0 0 0 4.3 5.1l-9.4 9.4a2 2 0 1 1-2.8-2.8l9.4-9.4a3.6 3.6 0 0 0-1.5-2.3Z" />
    <path d="M7 7 4.5 4.5" />
    <path d="M4.5 9.5 7 7" />
  </Svg>
);

export const IconRocket = (p) => (
  <Svg {...p}>
    <path d="M12 3.25c2.9 2.1 4.4 5.3 4.4 8.9L14.6 14H9.4l-1.8-1.85c0-3.6 1.5-6.8 4.4-8.9Z" />
    <circle cx="12" cy="9.6" r="1.5" />
    <path d="M9.4 14 7.6 17.8l2.6-1.1" />
    <path d="M14.6 14l1.8 3.8-2.6-1.1" />
  </Svg>
);

/* Interlocking rings read far better than a hand-shake at 20px */
export const IconHandshake = (p) => (
  <Svg {...p}>
    <circle cx="8.75" cy="12" r="4.75" />
    <circle cx="15.25" cy="12" r="4.75" />
  </Svg>
);

export const IconMail = (p) => (
  <Svg {...p}>
    <rect x="2.75" y="5" width="18.5" height="14" rx="2.5" />
    <path d="m3.5 7.5 7.3 5a2 2 0 0 0 2.4 0l7.3-5" />
  </Svg>
);

export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4.5 12h15" />
    <path d="m14 6.5 5.5 5.5L14 17.5" />
  </Svg>
);

export const IconArrowUp = (p) => (
  <Svg {...p}>
    <path d="M12 19.5v-15" />
    <path d="M5.5 11 12 4.5 18.5 11" />
  </Svg>
);

export const IconExpand = (p) => (
  <Svg {...p}>
    <path d="M14 4.5h5.5V10" />
    <path d="M10 19.5H4.5V14" />
    <path d="M19.5 4.5 13.5 10.5" />
    <path d="M4.5 19.5 10.5 13.5" />
  </Svg>
);

export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

/* Brand marks — filled paths, so they get their own wrapper */
const Brand = ({ children, size = 24, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
);

export const IconDiscord = (p) => (
  <Brand {...p}>
    <path d="M19.3 5.6A16.6 16.6 0 0 0 15.2 4.4l-.2.4a12.6 12.6 0 0 1 3.6 1.8 17.6 17.6 0 0 0-6.6-1.1c-2.3 0-4.5.4-6.6 1.1a12.6 12.6 0 0 1 3.6-1.8l-.2-.4a16.6 16.6 0 0 0-4.1 1.2C1.9 9.2 1.1 12.8 1.5 16.3a16.7 16.7 0 0 0 5.1 2.6l1-1.7a10.9 10.9 0 0 1-1.7-.8l.4-.3a11.9 11.9 0 0 0 10.2 0l.4.3a10.9 10.9 0 0 1-1.7.8l1 1.7a16.7 16.7 0 0 0 5.1-2.6c.5-4.1-.8-7.7-2.9-10.7ZM8.6 14.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.8 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
  </Brand>
);

export const IconX = (p) => (
  <Brand {...p}>
    <path d="M17.2 3h3.3l-7.2 8.2L21.8 21h-6.6l-5.2-6.7L4.1 21H.8l7.7-8.8L.5 3h6.8l4.7 6.2L17.2 3Zm-1.2 16h1.8L6.9 4.9H5L16 19Z" />
  </Brand>
);

/** Wordmark glyph — a hexagonal token with an inner vote check */
export const LogoMark = ({ size = 28, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    <defs>
      <linearGradient id="lp-logo-g" x1="4" y1="2" x2="28" y2="30">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
    <path
      d="M16 2.6 28 9.3v13.4L16 29.4 4 22.7V9.3Z"
      stroke="url(#lp-logo-g)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="m11 16.2 3.4 3.4L21 12.6"
      stroke="url(#lp-logo-g)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
