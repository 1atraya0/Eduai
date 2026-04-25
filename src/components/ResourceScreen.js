"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  NAV_ITEMS,
  ROUTE_LABELS,
  getRouteDirection,
  getRouteFromPath,
  isKnownRoute,
  normalizeRoute,
} from "@/lib/resourcePages";

const HOME_HERO_IMAGE =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80";
const MOBILE_TOP_ROUTES = ["/", "/flights", "/hotels", "/packages", "/dashboard"];

const FLIGHT_RESULTS = [
  {
    airline: "Air India",
    route: "DEL → BOM",
    time: "07:10 - 09:35",
    duration: "2h 25m",
    price: "₹6,450",
    badge: "Best value",
  },
  {
    airline: "Vistara",
    route: "DEL → BOM",
    time: "11:40 - 14:05",
    duration: "2h 25m",
    price: "₹7,240",
    badge: "Most flexible",
  },
  {
    airline: "IndiGo",
    route: "DEL → BOM",
    time: "19:05 - 21:35",
    duration: "2h 30m",
    price: "₹5,980",
    badge: "Lowest fare",
  },
];

const HOTEL_RESULTS = [
  {
    name: "The Coastal Arc",
    location: "Baga, Goa",
    price: "₹4,800",
    rating: "4.8",
    detail: "Beach walk, breakfast, and late checkout",
    image:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Heritage Cove",
    location: "South Goa",
    price: "₹6,250",
    rating: "4.9",
    detail: "Quiet stays with spa and sunset decks",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Urban Crest",
    location: "Bandra, Mumbai",
    price: "₹5,100",
    rating: "4.7",
    detail: "Business-friendly rooms and airport access",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  },
];

const PACKAGE_RESULTS = [
  {
    name: "Goa Weekend Escape",
    price: "₹14,900",
    days: "3D / 2N",
    tag: "Popular",
    detail: "Flight + stay + transfers for a quick recharge",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Kerala Slow Travel",
    price: "₹22,400",
    days: "5D / 4N",
    tag: "Best for couples",
    detail: "Backwaters, forest stays, and curated food trails",
    image:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Himalaya Family Loop",
    price: "₹31,500",
    days: "6D / 5N",
    tag: "Family pick",
    detail: "Air, stays, and flexible sightseeing blocks",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  },
];

const DASHBOARD_METRICS = [
  { label: "Trips planned", value: "18" },
  { label: "Saved on bundles", value: "₹42K" },
  { label: "Upcoming check-ins", value: "3" },
  { label: "Support replies", value: "2m" },
];

const ABOUT_VALUES = [
  {
    title: "Design for clarity",
    detail: "Every screen keeps the next action obvious so users do not get lost while booking.",
  },
  {
    title: "Move like a trip",
    detail: "Transitions are built to feel like progress, not like the browser is rebuilding a document.",
  },
  {
    title: "Phone-first by default",
    detail: "Layouts collapse cleanly, buttons stay thumb-sized, and content never depends on hover.",
  },
];

const TERMS_SECTIONS_COPY = [
  {
    id: "bookings",
    title: "Bookings Policy",
    detail: "All confirmed fares are subject to airline inventory and hotel availability at the moment of payment.",
  },
  {
    id: "cancellations",
    title: "Cancellations & Refunds",
    detail: "Refund timelines vary by supplier. Partially used itineraries may have airline or hotel deductions.",
  },
  {
    id: "payments",
    title: "Payment Terms",
    detail: "Secure payment is processed through verified gateways, and pending balances must clear before ticketing.",
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    detail: "We only keep travel details required for fulfilment and customer support.",
  },
  {
    id: "support",
    title: "Support & Escalation",
    detail: "Contact our travel desk for itinerary changes, invoice help, and booking confirmations.",
  },
];

const PAYMENT_METHODS = [
  { key: "upi", label: "UPI", detail: "Fastest checkout with instant confirmation" },
  { key: "card", label: "Card", detail: "Credit and debit cards accepted" },
  { key: "netbanking", label: "Netbanking", detail: "Use your bank account securely" },
];

const LOGIN_ADVANTAGES = [
  "Resume bookings across devices",
  "Keep traveller details ready for checkout",
  "Track confirmations and support replies",
];

const MOBILE_QUICK_ACTIONS = [
  {
    title: "Flights",
    route: "/flights",
    icon: "flights",
    tint: "from-cyan-300/30 to-cyan-500/20",
  },
  {
    title: "Hotels",
    route: "/hotels",
    icon: "hotels",
    tint: "from-emerald-300/30 to-emerald-500/20",
  },
  {
    title: "Packages",
    route: "/packages",
    icon: "packages",
    tint: "from-sky-300/30 to-sky-500/20",
  },
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: "dashboard",
    tint: "from-indigo-300/30 to-indigo-500/20",
  },
];

function cn(...values) {
  return values.filter(Boolean).join(" ");
}

function iconMark() {
  return <span className="text-base font-black tracking-tight">✈</span>;
}

function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-linear-to-br from-emerald-300 via-cyan-300 to-sky-300 text-slate-950 shadow-lg shadow-emerald-500/20",
          compact ? "h-10 w-10" : "h-12 w-12"
        )}
      >
        {iconMark()}
      </div>
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-emerald-200/70 whitespace-nowrap">
          Eduai Trips
        </p>
        <p
          className={cn(
            "font-semibold text-white whitespace-nowrap",
            compact ? "hidden sm:block text-sm" : "text-lg"
          )}
        >
          Travel command center
        </p>
      </div>
    </div>
  );
}

function Pill({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100",
        className
      )}
    >
      {children}
    </span>
  );
}

function Surface({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/7 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.75)] backdrop-blur-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function Button({ variant = "primary", className, children, ...props }) {
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 text-slate-950 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5",
    secondary:
      "border border-white/10 bg-white/6 text-slate-100 hover:border-white/20 hover:bg-white/10",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
    subtle:
      "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function NavButton({ route, activeRoute, onNavigate, children, mobile = false, disabled = false }) {
  const active = normalizeRoute(activeRoute) === route;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onNavigate(route)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
        mobile
          ? active
            ? "bg-white text-slate-950 shadow-lg shadow-cyan-500/20"
            : "bg-white/5 text-slate-100 hover:bg-white/10"
          : active
            ? "border border-cyan-300/30 bg-white/10 text-white"
            : "text-slate-300 hover:bg-white/6 hover:text-white",
        mobile ? "px-3 py-2 text-xs font-semibold" : "px-4 py-2.5 text-sm font-medium"
      )}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoCard({ title, detail, tag, price, footer, active = false, image }) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.8)] backdrop-blur-xl transition-all duration-300",
        active
          ? "border-emerald-300/40 bg-emerald-300/10"
          : "border-white/10 bg-white/6 hover:border-white/20 hover:bg-white/10"
      )}
    >
      {image ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/10">
          <img
            src={image}
            alt={title}
            className="h-40 w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          {tag ? <Pill className="mb-3">{tag}</Pill> : null}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
        </div>
        {price ? (
          <div className="rounded-2xl bg-slate-950/40 px-3 py-2 text-right">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">From</p>
            <p className="text-lg font-semibold text-white">{price}</p>
          </div>
        ) : null}
      </div>
      {footer ? <div className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">{footer}</div> : null}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <Pill>{eyebrow}</Pill>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">{description}</p>
    </div>
  );
}

function QuickActionIcon({ type }) {
  if (type === "flights") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 15.5l8-3.2L20 16l2-2.2-8.2-5V3.6L11.5 2l-1.3 6.1L4 9.4 2 8l.8 3.2-2.3.9z" />
      </svg>
    );
  }

  if (type === "hotels") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21V5a1 1 0 0 1 1-1h6v17" />
        <path d="M11 21h9V9a1 1 0 0 0-1-1h-8" />
        <path d="M7 8h1" />
        <path d="M7 11h1" />
        <path d="M7 14h1" />
        <path d="M14 12h2" />
        <path d="M14 15h2" />
      </svg>
    );
  }

  if (type === "packages") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M9 9V7a3 3 0 0 1 6 0v2" />
        <path d="M4 13h16" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function SceneLayer({ route, activeRoute, direction, previousRoute, children, onSceneScroll }) {
  const isActive = route === activeRoute;
  const isPrevious = route === previousRoute;

  const animationClass = isActive
    ? direction === "back"
      ? "scene-enter-back"
      : "scene-enter-forward"
    : isPrevious
      ? direction === "back"
        ? "scene-exit-back"
        : "scene-exit-forward"
      : "";

  return (
    <div
      className={cn(
        "scene-scroll absolute inset-0 overflow-y-auto px-4 pb-5 pt-20 md:px-6 md:py-6 lg:px-8 lg:py-8",
        isActive ? "z-20" : "z-10 pointer-events-none",
        animationClass
      )}
      onScroll={(event) => {
        if (isActive && onSceneScroll) {
          onSceneScroll(event);
        }
      }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </div>
  );
}

function HomeScene({ navigate, openTermsSection, showToast, activeRoute }) {
  const [tripMode, setTripMode] = useState("flights");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Surface className="relative overflow-hidden p-6 md:p-8">
          <img
            src={HOME_HERO_IMAGE}
            alt="Travel backdrop"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(2,6,23,0.78),rgba(2,6,23,0.58)),radial-gradient(circle_at_top_right,rgba(34,197,94,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.2),transparent_28%)]" />
          <div className="relative space-y-6">
            <Pill>Travel on one smooth surface</Pill>
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Discover incredible India and beyond.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-200/90 md:text-base">
                Plan flights, hotels, and packages without the browser feeling like it is loading a different document each time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate(tripMode === "flights" ? "/flights" : "/packages")}>Search now</Button>
              <Button variant="secondary" onClick={() => navigate("/dashboard")}>Open dashboard</Button>
              <Button variant="ghost" onClick={() => navigate("/login")}>Login / Signup</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Trips planned" value="18K+" />
              <StatCard label="Average savings" value="₹12.4K" />
              <StatCard label="Support speed" value="2m" />
            </div>
          </div>
        </Surface>

        <div className="grid grid-cols-2 gap-3 md:hidden">
          {MOBILE_QUICK_ACTIONS.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.route)}
              className="rounded-3xl border border-white/10 bg-white/6 p-4 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br text-xs font-bold text-white",
                  item.tint
                )}
              >
                <QuickActionIcon type={item.icon} />
              </span>
              <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-slate-300">Open</p>
            </button>
          ))}
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-3">
          {[
            {
              title: "Flights",
              detail: "Compare fares, switch cabins, and book the route that fits your date.",
              route: "/flights",
            },
            {
              title: "Hotels",
              detail: "Choose stay-first options with late checkout and breakfast included.",
              route: "/hotels",
            },
            {
              title: "Packages",
              detail: "Bundle flight and stay into one clean travel plan.",
              route: "/packages",
            },
          ].map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              detail={card.detail}
              footer={
                <Button variant="ghost" className="px-0 py-0 text-sm" onClick={() => navigate(card.route)}>
                  Explore {card.title.toLowerCase()}
                </Button>
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Surface className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Trip planner</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Choose what you want to book</h3>
            </div>
            <Pill>{ROUTE_LABELS[activeRoute] || "Home"}</Pill>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTripMode("flights")}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                tripMode === "flights"
                  ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                  : "border-white/10 bg-white/6 text-slate-300 hover:bg-white/10"
              )}
            >
              <p className="text-sm font-semibold">Flights</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Search departure, arrival, and dates</p>
            </button>
            <button
              type="button"
              onClick={() => setTripMode("packages")}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                tripMode === "packages"
                  ? "border-emerald-300/40 bg-emerald-300/10 text-white"
                  : "border-white/10 bg-white/6 text-slate-300 hover:bg-white/10"
              )}
            >
              <p className="text-sm font-semibold">Packages</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Bundle stays, flights, and transfers</p>
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">From</p>
              <p className="mt-1 text-sm font-semibold text-white">Delhi, India</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">To</p>
              <p className="mt-1 text-sm font-semibold text-white">Mumbai, India</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Date</p>
                <p className="mt-1 text-sm font-semibold text-white">24 Oct - 28 Oct</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Travellers</p>
                <p className="mt-1 text-sm font-semibold text-white">2 adults, 1 child</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => navigate(tripMode === "flights" ? "/flights" : "/packages")}>Search {tripMode}</Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Continue later</Button>
          </div>
        </Surface>

        <Surface className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Why this build feels smoother</p>
              <h3 className="mt-1 text-xl font-semibold text-white">One shell, many travel states</h3>
            </div>
            <Button variant="ghost" className="px-0 py-0 text-sm" onClick={() => showToast("This screen stays mounted while routes change.")}>Why it works</Button>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              "The header and frame stay alive while the content slides.",
              "Phone layouts keep the actions in reach at the bottom of the screen.",
              "Buttons always lead to an actual next step: search, reserve, pay, or review.",
            ].map((detail) => (
              <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {detail}
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function FlightsScene({ navigate, showToast }) {
  const mobileCarouselRef = useRef(null);
  const [activeMobileFare, setActiveMobileFare] = useState(0);

  const updateActiveFareFromScroll = () => {
    const container = mobileCarouselRef.current;

    if (!container) {
      return;
    }

    const cards = Array.from(container.querySelectorAll("[data-flight-card='true']"));

    if (!cards.length) {
      return;
    }

    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveMobileFare((prev) => (prev === nearestIndex ? prev : nearestIndex));
  };

  useEffect(() => {
    updateActiveFareFromScroll();
  }, []);

  return (
    <>
      <div className="space-y-6 lg:hidden">
        <Surface className="p-5">
          <div className="flex flex-wrap gap-2">
            <Pill>DEL → BOM</Pill>
            <Pill>Non-stop only</Pill>
            <Pill>Morning departures</Pill>
          </div>
        </Surface>

        <Surface className="p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Search summary</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs text-slate-400">Route</p>
              <p className="mt-1 text-base font-semibold text-white">Delhi to Mumbai</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Departure</p>
                <p className="mt-1 text-base font-semibold text-white">24 Oct, 07:10</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Cabin</p>
                <p className="mt-1 text-base font-semibold text-white">Economy Flex</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate("/hotels")}>Find hotels</Button>
            <Button variant="secondary" onClick={() => navigate("/packages")}>See packages</Button>
          </div>
        </Surface>

        <div className="space-y-3">
          <div className="px-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Available fares</p>
          </div>
          <div className="relative -mx-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-slate-950/75 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-slate-950/75 to-transparent" />

            <div
              ref={mobileCarouselRef}
              onScroll={updateActiveFareFromScroll}
              className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2"
            >
              {FLIGHT_RESULTS.map((flight, index) => (
                <div
                  key={flight.airline}
                  data-flight-card="true"
                  className={cn(
                    "flight-fare-card min-w-0 shrink-0 snap-center rounded-3xl border p-5 transition-all duration-300",
                    "basis-[86%]",
                    activeMobileFare === index
                      ? "flight-fare-card-wipe border-emerald-300/30 bg-emerald-300/10"
                      : "border-white/10 bg-white/6"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Pill>{flight.badge}</Pill>
                    <p className="text-sm text-slate-400">{flight.airline}</p>
                  </div>
                  <h3 className="mt-3 text-4xl font-semibold leading-tight text-white">{flight.route}</h3>
                  <p className="mt-1 text-sm text-slate-300">{flight.time} · {flight.duration}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">From</p>
                      <p className="text-5xl font-semibold leading-none text-white">{flight.price}</p>
                    </div>
                    <Button onClick={() => navigate("/payment")}>Choose fare</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Surface className="p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Flight tools</p>
          <div className="mt-4 grid gap-3">
            {[
              "Filter by baggage and fare flexibility.",
              "Compare connecting and non-stop choices at a glance.",
              "Move to payment only when the fare feels right.",
            ].map((detail) => (
              <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {detail}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="ghost" className="px-0 py-0 text-sm" onClick={() => showToast("Fare rules are ready to be shown in a modal if you want more detail.")}>View fare rules</Button>
            <Button variant="ghost" className="px-0 py-0 text-sm" onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
          </div>
        </Surface>
      </div>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Surface className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SectionHeading
                eyebrow="Flights"
                title="Fast fare comparison with a clear next step."
                description="See the best value, fastest duration, and flexible choices without the page flashing or rebuilding around you."
              />
              <div className="flex flex-wrap gap-2">
                <Pill>DEL → BOM</Pill>
                <Pill>Non-stop only</Pill>
                <Pill>Morning departures</Pill>
              </div>
            </div>
          </Surface>

          <div className="grid gap-4">
            {FLIGHT_RESULTS.map((flight, index) => (
              <Surface key={flight.airline} className={cn("p-5 md:p-6", index === 0 ? "border-emerald-300/30 bg-emerald-300/10" : "") }>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Pill>{flight.badge}</Pill>
                      <p className="text-sm text-slate-400">{flight.airline}</p>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{flight.route}</h3>
                    <p className="mt-1 text-sm text-slate-300">{flight.time} · {flight.duration}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">From</p>
                      <p className="text-3xl font-semibold text-white">{flight.price}</p>
                    </div>
                    <Button onClick={() => navigate("/payment")}>Choose fare</Button>
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Surface className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Search summary</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Route</p>
                <p className="mt-1 text-base font-semibold text-white">Delhi to Mumbai</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs text-slate-400">Departure</p>
                  <p className="mt-1 text-base font-semibold text-white">24 Oct, 07:10</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs text-slate-400">Cabin</p>
                  <p className="mt-1 text-base font-semibold text-white">Economy Flex</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate("/hotels")}>Find hotels</Button>
              <Button variant="secondary" onClick={() => navigate("/packages")}>See packages</Button>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Flight tools</p>
            <div className="mt-4 grid gap-3">
              {[
                "Filter by baggage and fare flexibility.",
                "Compare connecting and non-stop choices at a glance.",
                "Move to payment only when the fare feels right.",
              ].map((detail) => (
                <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  {detail}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="ghost" className="px-0 py-0 text-sm" onClick={() => showToast("Fare rules are ready to be shown in a modal if you want more detail.")}>View fare rules</Button>
              <Button variant="ghost" className="px-0 py-0 text-sm" onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

function HotelsScene({ navigate }) {
  const mobileCarouselRef = useRef(null);
  const [activeMobileHotel, setActiveMobileHotel] = useState(0);

  const updateActiveHotelFromScroll = () => {
    const container = mobileCarouselRef.current;

    if (!container) {
      return;
    }

    const cards = Array.from(container.querySelectorAll("[data-hotel-card='true']"));

    if (!cards.length) {
      return;
    }

    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveMobileHotel((prev) => (prev === nearestIndex ? prev : nearestIndex));
  };

  useEffect(() => {
    updateActiveHotelFromScroll();
  }, []);

  return (
    <>
      <div className="space-y-6 lg:hidden">
        <Surface className="p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Stay planner</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs text-slate-400">Destination</p>
              <p className="mt-1 text-base font-semibold text-white">Goa, India</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Check-in</p>
                <p className="mt-1 text-base font-semibold text-white">24 Oct</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Guests</p>
                <p className="mt-1 text-base font-semibold text-white">2 adults</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate("/packages")}>Compare packages</Button>
            <Button variant="secondary" onClick={() => navigate("/flights")}>Check flights</Button>
          </div>
        </Surface>

        <div className="space-y-3">
          <div className="px-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Available stays</p>
          </div>
          <div className="relative -mx-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-slate-950/75 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-slate-950/75 to-transparent" />

            <div
              ref={mobileCarouselRef}
              onScroll={updateActiveHotelFromScroll}
              className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2"
            >
              {HOTEL_RESULTS.map((hotel, index) => (
                <div
                  key={hotel.name}
                  data-hotel-card="true"
                  className={cn(
                    "flight-fare-card min-w-0 shrink-0 snap-center rounded-3xl border p-5 transition-all duration-300",
                    "basis-[86%]",
                    activeMobileHotel === index
                      ? "flight-fare-card-wipe border-emerald-300/30 bg-emerald-300/10"
                      : "border-white/10 bg-white/6"
                  )}
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-36 w-full rounded-2xl border border-white/10 object-cover object-center"
                    loading="lazy"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <Pill>{hotel.rating} rating</Pill>
                    <p className="text-sm text-slate-400">{hotel.location}</p>
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight text-white">{hotel.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{hotel.detail}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Per night</p>
                      <p className="text-5xl font-semibold leading-none text-white">{hotel.price}</p>
                    </div>
                    <Button onClick={() => navigate("/payment")}>Reserve room</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Surface className="p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Hotel tools</p>
          <div className="mt-4 grid gap-3">
            {[
              "Late checkout and breakfast labels stay visible.",
              "Rooms can be reserved without leaving the screen mid-flow.",
              "The same shell keeps the page feeling like one app.",
            ].map((detail) => (
              <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {detail}
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Surface className="p-6 md:p-8">
            <SectionHeading
              eyebrow="Hotels"
              title="Stays that feel calm, clean, and easy to book on mobile."
              description="Good hotel picking is more than a list. The page keeps your stay choices visible and makes it simple to reserve the room that fits the trip."
            />
          </Surface>

          <div className="grid gap-4">
            {HOTEL_RESULTS.map((hotel) => (
              <Surface key={hotel.name} className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-24 w-28 rounded-2xl border border-white/10 object-cover object-center md:h-28 md:w-36"
                      loading="lazy"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Pill>{hotel.rating} rating</Pill>
                        <p className="text-sm text-slate-400">{hotel.location}</p>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{hotel.name}</h3>
                      <p className="mt-1 text-sm text-slate-300">{hotel.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Per night</p>
                      <p className="text-3xl font-semibold text-white">{hotel.price}</p>
                    </div>
                    <Button onClick={() => navigate("/payment")}>Reserve room</Button>
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Surface className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Stay planner</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Destination</p>
                <p className="mt-1 text-base font-semibold text-white">Goa, India</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs text-slate-400">Check-in</p>
                  <p className="mt-1 text-base font-semibold text-white">24 Oct</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs text-slate-400">Guests</p>
                  <p className="mt-1 text-base font-semibold text-white">2 adults</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate("/packages")}>Compare packages</Button>
              <Button variant="secondary" onClick={() => navigate("/flights")}>Check flights</Button>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Hotel tools</p>
            <div className="mt-4 grid gap-3">
              {[
                "Late checkout and breakfast labels stay visible.",
                "Rooms can be reserved without leaving the screen mid-flow.",
                "The same shell keeps the page feeling like one app.",
              ].map((detail) => (
                <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  {detail}
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

function PackagesScene({ navigate, showToast, selectedPackage, setSelectedPackage }) {
  const mobileCarouselRef = useRef(null);
  const [activeMobilePackage, setActiveMobilePackage] = useState(0);

  const updateActivePackageFromScroll = () => {
    const container = mobileCarouselRef.current;

    if (!container) {
      return;
    }

    const cards = Array.from(container.querySelectorAll("[data-package-card='true']"));

    if (!cards.length) {
      return;
    }

    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveMobilePackage((prev) => (prev === nearestIndex ? prev : nearestIndex));
  };

  useEffect(() => {
    updateActivePackageFromScroll();
  }, []);

  return (
    <>
      <div className="space-y-6 lg:hidden">
        <Surface className="p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Package summary</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Pick a bundle, then tune it to your trip.</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs text-slate-400">Included</p>
              <p className="mt-1 text-base font-semibold text-white">Flight, hotel, and airport transfer</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs text-slate-400">Upgrade note</p>
              <p className="mt-1 text-base font-semibold text-white">Add sightseeing, meals, or extra nights</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/payment")}>Reserve package</Button>
            <Button variant="secondary" onClick={() => navigate("/flights")}>Browse flights</Button>
          </div>
        </Surface>

        <div className="space-y-3">
          <div className="px-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Featured packages</p>
          </div>
          <div className="relative -mx-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-slate-950/75 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-slate-950/75 to-transparent" />

            <div
              ref={mobileCarouselRef}
              onScroll={updateActivePackageFromScroll}
              className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2"
            >
              {PACKAGE_RESULTS.map((pack, index) => (
                <div
                  key={pack.name}
                  data-package-card="true"
                  className={cn(
                    "flight-fare-card min-w-0 shrink-0 snap-center rounded-3xl border p-5 transition-all duration-300",
                    "basis-[86%]",
                    activeMobilePackage === index
                      ? "flight-fare-card-wipe border-emerald-300/30 bg-emerald-300/10"
                      : "border-white/10 bg-white/6"
                  )}
                >
                  <img
                    src={pack.image}
                    alt={pack.name}
                    className="h-36 w-full rounded-2xl border border-white/10 object-cover object-center"
                    loading="lazy"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <Pill>{`${pack.days} · ${pack.tag}`}</Pill>
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold leading-tight text-white">{pack.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{pack.detail}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">From</p>
                      <p className="text-5xl font-semibold leading-none text-white">{pack.price}</p>
                    </div>
                    <Button
                      variant={selectedPackage === index ? "primary" : "secondary"}
                      className="px-3 py-2 text-xs"
                      onClick={() => {
                        setSelectedPackage(index);
                        navigate("/payment");
                      }}
                    >
                      Reserve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Surface className="p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Travel tools</p>
          <div className="mt-4 grid gap-3">
            {[
              "Selecting a card highlights the package you are considering.",
              "Reserve now sends you to the payment flow instead of hiding the action.",
              "The design works as a stack on narrow screens and a grid on desktop.",
            ].map((detail) => (
              <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {detail}
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 px-0 py-2 text-sm" onClick={() => showToast("Package selection saved for comparison.")}>Save for later</Button>
        </Surface>
      </div>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Surface className="p-6 md:p-8">
            <SectionHeading
              eyebrow="Packages"
              title="Holiday bundles designed to feel curated, not crowded."
              description="Packages are where flights, stays, and transfers become one decision. This screen keeps the best options readable on desktop and thumb-friendly on mobile."
            />
          </Surface>

          <div className="grid gap-4 md:grid-cols-2">
            {PACKAGE_RESULTS.map((pack, index) => (
              <InfoCard
                key={pack.name}
                title={pack.name}
                detail={pack.detail}
                tag={`${pack.days} · ${pack.tag}`}
                price={pack.price}
                image={pack.image}
                footer={
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={selectedPackage === index ? "primary" : "secondary"}
                      className="px-3 py-2 text-xs"
                      onClick={() => setSelectedPackage(index)}
                    >
                      {selectedPackage === index ? "Selected" : "Select package"}
                    </Button>
                    <Button variant="ghost" className="px-0 py-2 text-xs" onClick={() => navigate("/payment")}>Reserve now</Button>
                  </div>
                }
                active={selectedPackage === index}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Surface className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Package summary</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Pick a bundle, then tune it to your trip.</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Included</p>
                <p className="mt-1 text-base font-semibold text-white">Flight, hotel, and airport transfer</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">Upgrade note</p>
                <p className="mt-1 text-base font-semibold text-white">Add sightseeing, meals, or extra nights</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/payment")}>Reserve package</Button>
              <Button variant="secondary" onClick={() => navigate("/flights")}>Browse flights</Button>
            </div>
          </Surface>

          <Surface className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Travel tools</p>
            <div className="mt-4 grid gap-3">
              {[
                "Selecting a card highlights the package you are considering.",
                "Reserve now sends you to the payment flow instead of hiding the action.",
                "The design works as a stack on narrow screens and a grid on desktop.",
              ].map((detail) => (
                <div key={detail} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  {detail}
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 px-0 py-2 text-sm" onClick={() => showToast("Package selection saved for comparison.")}>Save for later</Button>
          </Surface>
        </div>
      </div>
    </>
  );
}

function DashboardScene({ navigate, showToast }) {
  return (
    <div className="space-y-6">
      <Surface className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading
            eyebrow="Dashboard"
            title="Your travel control room with everything in one glance."
            description="Upcoming trips, pending balances, and quick actions are collected here so the next step is never hidden behind a reload." 
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/flights")}>Resume booking</Button>
            <Button variant="secondary" onClick={() => navigate("/payment")}>Pay balance</Button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_METRICS.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Surface className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Upcoming itinerary</p>
          <div className="mt-4 space-y-4">
            {[
              ["24 Oct", "Flight to Goa", "Departure 07:10 · Check-in 13:00"],
              ["25 Oct", "Beach day", "Reserved cabana and dinner table"],
              ["28 Oct", "Return to Delhi", "Morning flight, baggage included"],
            ].map(([date, title, detail]) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="min-w-16 rounded-2xl bg-emerald-300/10 px-3 py-2 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">{date}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-slate-300">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Fast actions</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Flights", route: "/flights" },
              { label: "Hotels", route: "/hotels" },
              { label: "Packages", route: "/packages" },
              { label: "Login", route: "/login" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.route)}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-left transition-all duration-300 hover:border-white/20 hover:bg-slate-950/60"
              >
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs text-slate-400">Open this section instantly</p>
              </button>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 px-0 py-2 text-sm" onClick={() => showToast("Dashboard activity refreshed.")}>Refresh activity</Button>
        </Surface>
      </div>
    </div>
  );
}

function AboutScene({ navigate }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Surface className="p-6 md:p-8">
          <SectionHeading
            eyebrow="About"
            title="Built to feel intentional, warm, and dependable."
            description="Eduai Trips is a travel experience designed to keep planning calm. The interface should help people move from idea to booking without the feeling that the app is starting over on every tab change."
          />
        </Surface>

        <div className="grid gap-4 md:grid-cols-3">
          {ABOUT_VALUES.map((value) => (
            <InfoCard key={value.title} title={value.title} detail={value.detail} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Surface className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">The principle</p>
          <p className="mt-3 text-lg leading-8 text-white">
            A travel app should feel like one continuous place. The header, navigation, and main surface stay present while the destination content changes with clear motion.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/packages")}>Explore packages</Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Open dashboard</Button>
          </div>
        </Surface>

        <Surface className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Action links</p>
          <div className="mt-4 grid gap-3">
            {[
              { label: "Login / Signup", route: "/login" },
              { label: "Flights", route: "/flights" },
              { label: "Terms", route: "/terms" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.route)}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function TermsScene({ navigate, openSection }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
      <Surface className="p-5 md:p-6 lg:sticky lg:top-6 lg:self-start">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Contents</p>
        <div className="mt-4 grid gap-2">
          {TERMS_SECTIONS_COPY.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => openSection(section.id)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              {section.title}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => navigate("/login")}>Contact support</Button>
          <Button variant="secondary" onClick={() => navigate("/")}>Back home</Button>
        </div>
      </Surface>

      <div className="space-y-4">
        <Surface className="p-6 md:p-8">
          <SectionHeading
            eyebrow="Legal"
            title="Terms & Conditions"
            description="These terms are presented in a clean, readable way with section anchors so users can jump to the part they need on mobile or desktop."
          />
        </Surface>
        {TERMS_SECTIONS_COPY.map((section) => (
          <Surface key={section.id} className="p-5 md:p-6" id={section.id}>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{section.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{section.detail}</p>
          </Surface>
        ))}
      </div>
    </div>
  );
}

function LoginScene({ navigate, loginStep, setLoginStep, otpCode, setOtpCode, showToast }) {
  const otpComplete = otpCode.every(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Surface className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_28%)]" />
        <div className="relative space-y-5">
          <Pill>Secure sign in</Pill>
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">Welcome back.</h2>
          <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            Use a quick OTP flow to resume bookings, keep passenger details ready, and reach payment without starting over.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {LOGIN_ADVANTAGES.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/6 p-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate("/")}>Browse as guest</Button>
            <Button variant="ghost" className="px-0 py-0" onClick={() => navigate("/terms")}>Need help?</Button>
          </div>
        </div>
      </Surface>

      <Surface className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Account access</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Login / Signup</h3>
          </div>
          <Pill>{loginStep === "mobile" ? "Step 1" : "Step 2"}</Pill>
        </div>

        {loginStep === "mobile" ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mobile number</p>
              <p className="mt-1 text-base font-semibold text-white">+91 98765 43210</p>
            </div>
            <Button
              onClick={() => {
                setLoginStep("otp");
                showToast("OTP sent to your number.");
              }}
            >
              Send OTP
            </Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Use saved account</Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  value={otpCode[index] || ""}
                  onChange={(event) => {
                    const next = [...otpCode];
                    next[index] = event.target.value.slice(-1);
                    setOtpCode(next);
                  }}
                  className="h-14 rounded-2xl border border-white/10 bg-slate-950/45 text-center text-lg font-semibold text-white outline-none transition-all focus:border-cyan-300/60 focus:bg-slate-950/70"
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (!otpComplete) {
                  showToast("Enter all 4 OTP digits first.");
                  return;
                }
                showToast("Account verified.");
                navigate("/dashboard");
              }}
            >
              Verify & continue
            </Button>
            <Button variant="secondary" onClick={() => setLoginStep("mobile")}>Change number</Button>
          </div>
        )}
      </Surface>
    </div>
  );
}

function PaymentScene({ navigate, paymentMethod, setPaymentMethod, showToast }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Surface className="p-6 md:p-8">
        <SectionHeading
          eyebrow="Payment"
          title="A checkout that feels calm, not like a dead end."
          description="Choose a payment method, review the summary, and finish the booking with a clear path back into the dashboard."
        />
        <div className="mt-6 grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Goa Weekend Escape</p>
              <Pill>₹14,900</Pill>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div>Flight included</div>
              <div>2 nights stay</div>
              <div>Airport transfers</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.key}
                type="button"
                onClick={() => setPaymentMethod(method.key)}
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                  paymentMethod === method.key
                    ? "border-emerald-300/40 bg-emerald-300/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <p className="text-sm font-semibold text-white">{method.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{method.detail}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                showToast(`Paid with ${paymentMethod.toUpperCase()}.`);
                window.setTimeout(() => navigate("/dashboard"), 900);
              }}
            >
              Pay securely
            </Button>
            <Button variant="secondary" onClick={() => navigate("/flights")}>Edit flights</Button>
            <Button variant="secondary" onClick={() => navigate("/packages")}>Edit packages</Button>
          </div>
        </div>
      </Surface>

      <div className="space-y-6">
        <Surface className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">What happens next</p>
          <div className="mt-4 grid gap-3">
            {[
              "Payment confirmation lands on the dashboard immediately.",
              "A fast success message keeps the user from wondering whether the booking completed.",
              "The flow returns to a useful screen instead of leaving the user at a dead end.",
            ].map((detail) => (
              <div key={detail} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-slate-300">
                {detail}
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Need a change?</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate("/login")}>Update traveller</Button>
            <Button variant="ghost" className="px-0 py-0" onClick={() => navigate("/")}>Back home</Button>
          </div>
        </Surface>
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="fixed bottom-24 right-4 z-50 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-2xl shadow-black/30 backdrop-blur-xl md:bottom-6 md:right-6">
      {message}
    </div>
  );
}

export default function ResourceScreen({ initialRoute = "/" }) {
  const normalizedInitialRoute = normalizeRoute(initialRoute);
  const [activeRoute, setActiveRoute] = useState(isKnownRoute(normalizedInitialRoute) ? normalizedInitialRoute : "/");
  const [previousRoute, setPreviousRoute] = useState(null);
  const [direction, setDirection] = useState("forward");
  const [toast, setToast] = useState(null);
  const [pendingAnchor, setPendingAnchor] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [loginStep, setLoginStep] = useState("mobile");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFloatingStrip, setShowFloatingStrip] = useState(true);
  const contentRef = useRef(null);
  const previousTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const transitionLockRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const stripVisibleRef = useRef(true);

  const clearTimers = () => {
    if (previousTimerRef.current) {
      window.clearTimeout(previousTimerRef.current);
      previousTimerRef.current = null;
    }

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    transitionLockRef.current = false;
    setIsTransitioning(false);
  };

  const showToast = (message) => {
    setToast(message);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const handleSceneScroll = (event) => {
    const currentTop = event.currentTarget.scrollTop;
    const previousTop = lastScrollTopRef.current;
    const delta = currentTop - previousTop;

    if (currentTop <= 24) {
      if (!stripVisibleRef.current) {
        stripVisibleRef.current = true;
        setShowFloatingStrip(true);
      }

      lastScrollTopRef.current = currentTop;
      return;
    }

    if (delta > 8 && stripVisibleRef.current) {
      stripVisibleRef.current = false;
      setShowFloatingStrip(false);
    } else if (delta < -8 && !stripVisibleRef.current) {
      stripVisibleRef.current = true;
      setShowFloatingStrip(true);
    }

    lastScrollTopRef.current = currentTop;
  };

  const scrollToAnchor = (anchorId) => {
    if (!anchorId) {
      return;
    }

    window.setTimeout(() => {
      const target = document.getElementById(anchorId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const commitRoute = (nextRoute, { replace = false, anchorId = null } = {}) => {
    const route = normalizeRoute(nextRoute);

    if (!isKnownRoute(route)) {
      return;
    }

    if (route === activeRoute) {
      if (anchorId) {
        setPendingAnchor(anchorId);
      }
      return;
    }

    if (transitionLockRef.current) {
      return;
    }

    clearTimers();
    transitionLockRef.current = true;
    setIsTransitioning(true);
    setDirection(getRouteDirection(activeRoute, route));
    setPreviousRoute(activeRoute);
    setActiveRoute(route);
    setPendingAnchor(anchorId);

    if (!replace) {
      window.history.pushState({}, "", route);
    }

    previousTimerRef.current = window.setTimeout(() => {
      setPreviousRoute(null);
      transitionLockRef.current = false;
      setIsTransitioning(false);
    }, 580);
  };

  const navigate = (nextRoute, options = {}) => {
    commitRoute(nextRoute, options);
  };

  const goToTermsSection = (sectionId) => {
    if (activeRoute !== "/terms") {
      commitRoute("/terms", { anchorId: sectionId });
      return;
    }

    scrollToAnchor(sectionId);
  };

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteFromPath(window.location.pathname);
      clearTimers();
      transitionLockRef.current = true;
      setIsTransitioning(true);
      setDirection(getRouteDirection(activeRoute, nextRoute));
      setPreviousRoute(activeRoute);
      setActiveRoute(nextRoute);
      previousTimerRef.current = window.setTimeout(() => {
        setPreviousRoute(null);
        transitionLockRef.current = false;
        setIsTransitioning(false);
      }, 580);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [activeRoute]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    lastScrollTopRef.current = 0;
    stripVisibleRef.current = true;
    setShowFloatingStrip(true);
  }, [activeRoute]);

  useEffect(() => {
    if (pendingAnchor && activeRoute === "/terms") {
      scrollToAnchor(pendingAnchor);
      setPendingAnchor(null);
    }
  }, [activeRoute, pendingAnchor]);

  const renderScene = (route) => {
    switch (route) {
      case "/flights":
        return <FlightsScene navigate={navigate} showToast={showToast} />;
      case "/hotels":
        return <HotelsScene navigate={navigate} />;
      case "/packages":
        return (
          <PackagesScene
            navigate={navigate}
            showToast={showToast}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />
        );
      case "/dashboard":
        return <DashboardScene navigate={navigate} showToast={showToast} />;
      case "/about":
        return <AboutScene navigate={navigate} />;
      case "/terms":
        return <TermsScene navigate={navigate} openSection={goToTermsSection} />;
      case "/login":
        return (
          <LoginScene
            navigate={navigate}
            loginStep={loginStep}
            setLoginStep={setLoginStep}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            showToast={showToast}
          />
        );
      case "/payment":
        return (
          <PaymentScene
            navigate={navigate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            showToast={showToast}
          />
        );
      case "/":
      default:
        return <HomeScene navigate={navigate} openTermsSection={goToTermsSection} showToast={showToast} activeRoute={activeRoute} />;
    }
  };

  const activeScene = renderScene(activeRoute);
  const previousScene = previousRoute ? renderScene(previousRoute) : null;

  return (
    <div className="relative min-h-dvh overflow-hidden text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(8,17,34,0.9)_45%,rgba(15,23,42,0.98))]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/72 backdrop-blur-2xl">
          <div className="mx-auto flex w-full max-w-360 items-center justify-between gap-4 px-4 py-4 lg:px-6">
            <button type="button" onClick={() => navigate("/")} className="text-left">
              <BrandMark compact />
            </button>

            <nav className="hidden items-center gap-2 xl:flex">
              {NAV_ITEMS.map((item) => (
                <NavButton key={item.route} route={item.route} activeRoute={activeRoute} onNavigate={navigate} disabled={isTransitioning}>
                  {item.label}
                </NavButton>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="px-2.5 py-1.5 text-xs md:px-4 md:py-2.5 md:text-sm" onClick={() => navigate("/terms")}>Support</Button>
              <Button variant="secondary" className="px-2.5 py-1.5 text-xs sm:px-4 sm:py-2.5 sm:text-sm" onClick={() => navigate("/login")}>Login / Signup</Button>
            </div>
          </div>

        </header>

        <main className="mx-auto flex w-full max-w-360 flex-1 px-4 pb-6 pt-4 lg:px-6 lg:pb-6">
          <div
            ref={contentRef}
            className="relative flex-1 overflow-hidden rounded-4xl"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-x-3 top-3 z-30 transition-all duration-300 xl:hidden",
                showFloatingStrip ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
              )}
            >
              <div
                className={cn(
                  "mx-auto max-w-full overflow-x-auto hide-scrollbar rounded-full border border-white/15 bg-slate-900/55 p-1 backdrop-blur-xl",
                  showFloatingStrip ? "pointer-events-auto" : "pointer-events-none"
                )}
              >
                <div className="flex min-w-max items-center gap-1.5">
                  {MOBILE_TOP_ROUTES.map((route) => (
                    <NavButton
                      key={route}
                      route={route}
                      activeRoute={activeRoute}
                      onNavigate={navigate}
                      mobile
                      disabled={isTransitioning}
                    >
                      {ROUTE_LABELS[route]}
                    </NavButton>
                  ))}
                </div>
              </div>
            </div>

            {previousScene ? (
              <SceneLayer route={previousRoute} activeRoute={activeRoute} direction={direction} previousRoute={previousRoute} onSceneScroll={handleSceneScroll}>
                {previousScene}
              </SceneLayer>
            ) : null}
            <SceneLayer route={activeRoute} activeRoute={activeRoute} direction={direction} previousRoute={previousRoute} onSceneScroll={handleSceneScroll}>
              {activeScene}
            </SceneLayer>
          </div>
        </main>

        {toast ? <Toast message={toast} /> : null}
      </div>
    </div>
  );
}
