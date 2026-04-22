"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RESOURCE_PAGE_BY_ROUTE, getResourcePageByRoute } from "@/lib/resourcePages";

const TEXT_TO_ROUTE = {
  home: "/",
  flights: "/flights",
  hotels: "/hotels",
  hotel: "/hotels",
  packages: "/packages",
  dashboard: "/dashboard",
  "about us": "/about",
  "t&c": "/terms",
  terms: "/terms",
  "terms & conditions": "/terms",
  "privacy policy": "/terms",
  "login / signup": "/login",
  "back to home": "/",
  "go to dashboard": "/dashboard",
  "explore packages": "/packages",
  "search flights": "/flights",
  "book now": "/payment",
  "new booking": "/flights",
  "verify & continue": "/",
};

const FORCED_NAV_LABELS = new Set([
  "login / signup",
  "back to home",
  "go to dashboard",
  "explore packages",
  "search flights",
  "book now",
  "new booking",
  "verify & continue",
  "terms & conditions",
  "privacy policy",
]);

const PRIMARY_ROUTE_BY_SRC = Object.entries(RESOURCE_PAGE_BY_ROUTE).reduce((acc, [routeKey, resourceSrc]) => {
  if (!resourceSrc || acc[resourceSrc]) {
    return acc;
  }

  acc[resourceSrc] = routeKey ? `/${routeKey}` : "/";
  return acc;
}, {});

const PRELOADED_ROUTES = Array.from(new Set(Object.values(PRIMARY_ROUTE_BY_SRC)));

function normalizeText(value) {
  return (value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function getRouteFromLabel(label) {
  if (!label) {
    return undefined;
  }

  for (const [key, route] of Object.entries(TEXT_TO_ROUTE)) {
    if (label === key || label.includes(key)) {
      return route;
    }
  }

  return undefined;
}

function isForcedLabel(label) {
  if (!label) {
    return false;
  }

  for (const forced of FORCED_NAV_LABELS) {
    if (label === forced || label.includes(forced)) {
      return true;
    }
  }

  return false;
}

export default function ResourceScreen({ src }) {
  const iframeRefs = useRef({});
  const [activeRoute, setActiveRoute] = useState("/");
  const [loadedRoutes, setLoadedRoutes] = useState({});

  const getRouteKey = useCallback((route) => {
    if (!route || route === "/") {
      return "";
    }

    return route.replace(/^\/+/, "");
  }, []);

  const normalizeRoute = useCallback((route) => {
    if (!route || route === "/") {
      return "/";
    }

    const cleanRoute = route.split("?")[0].split("#")[0];
    return `/${cleanRoute.replace(/^\/+/, "")}`;
  }, []);

  const getRouteFromSrc = useCallback((resourceSrc) => {
    return PRIMARY_ROUTE_BY_SRC[resourceSrc] || "/";
  }, []);

  const getCurrentPath = useCallback(() => {
    if (typeof window === "undefined") {
      return "/";
    }

    return window.location.pathname || "/";
  }, []);

  const getSrcForRoute = useCallback(
    (route) => {
      const routeKey = getRouteKey(normalizeRoute(route));
      return getResourcePageByRoute(routeKey);
    },
    [getRouteKey, normalizeRoute]
  );

  const navigateTo = useCallback(
    (route) => {
      if (!route) {
        return;
      }

      const nextRoute = normalizeRoute(route);
      const nextSrc = getSrcForRoute(nextRoute);

      if (!nextSrc) {
        return;
      }

      if (nextRoute === activeRoute && nextRoute === normalizeRoute(getCurrentPath())) {
        return;
      }

      const navigate = () => {
        setActiveRoute(nextRoute);
        window.history.pushState({}, "", nextRoute);
      };

      if (typeof document !== "undefined" && "startViewTransition" in document) {
        document.startViewTransition(navigate);
        return;
      }

      navigate();
    },
    [activeRoute, getCurrentPath, getSrcForRoute, normalizeRoute]
  );

  const processDummyPayment = useCallback(async () => {
    try {
      await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 5150,
          currency: "INR",
          source: "payment-screen",
        }),
      });
    } catch {
      // Keep flow moving in demo mode even if API call fails.
    }
  }, []);

  const bindNavigation = useCallback((iframe) => {
    if (!iframe || !iframe.contentDocument) {
      return;
    }

    const doc = iframe.contentDocument;
    const interactiveEls = doc.querySelectorAll(
      "a, button, [role='button'], input[type='button'], input[type='submit']"
    );

    const addRouteHandler = (el, route) => {
      if (!route || el.dataset.routeBound === "true") {
        return;
      }

      el.dataset.routeBound = "true";

      el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (route === "/dashboard" && normalizeText(el.textContent || el.value).startsWith("pay ")) {
          processDummyPayment().finally(() => {
            window.setTimeout(() => navigateTo(route), 2200);
          });
          return;
        }

        navigateTo(route);
      });
    };

    interactiveEls.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      const label = normalizeText(el.textContent || el.value);
      const inlineOnClick = el.getAttribute("onclick");

      if (tagName === "a") {
        const href = (el.getAttribute("href") || "").trim();

        if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
          return;
        }

        if (href.startsWith("#") && href.length > 1) {
          return;
        }

        if (!href || href === "#") {
          const route = getRouteFromLabel(label);
          addRouteHandler(el, route);
          return;
        }

        const route = href === "/" ? "/" : `/${href.replace(/^\/+/, "")}`;
        addRouteHandler(el, route);
        return;
      }

      if (inlineOnClick && !isForcedLabel(label)) {
        return;
      }

      if (label.startsWith("pay ")) {
        addRouteHandler(el, "/dashboard");
        return;
      }

      const route = getRouteFromLabel(label);
      addRouteHandler(el, route);
    });

    const forms = doc.querySelectorAll("form");
    forms.forEach((form) => {
      const submitLabel = normalizeText(
        form.querySelector("button[type='submit'], input[type='submit']")?.textContent ||
          form.querySelector("button[type='submit'], input[type='submit']")?.value
      );

      if (!submitLabel) {
        return;
      }

      if (submitLabel === "search flights") {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          navigateTo("/flights");
        });
      }
    });
  }, [navigateTo, processDummyPayment]);

  useEffect(() => {
    const pathRoute = normalizeRoute(getCurrentPath());
    const pathSrc = getSrcForRoute(pathRoute);

    if (pathSrc) {
      setActiveRoute(pathRoute);
      return;
    }

    const srcRoute = getRouteFromSrc(src);
    setActiveRoute(srcRoute);
    window.history.replaceState({}, "", srcRoute);
  }, [getCurrentPath, getRouteFromSrc, getSrcForRoute, normalizeRoute, src]);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = normalizeRoute(getCurrentPath());
      const nextSrc = getSrcForRoute(nextRoute);

      if (!nextSrc) {
        return;
      }

      setActiveRoute(nextRoute);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [getCurrentPath, getSrcForRoute, normalizeRoute]);

  const renderedRoutes = useMemo(() => {
    const uniqueRoutes = new Set([activeRoute, ...PRELOADED_ROUTES]);
    return Array.from(uniqueRoutes).filter((route) => getSrcForRoute(route));
  }, [activeRoute, getSrcForRoute]);

  return (
    <main className="flex-1 relative h-dvh overflow-hidden">
      {renderedRoutes.map((route) => {
        const frameSrc = getSrcForRoute(route);
        const isActive = route === activeRoute;
        const isLoaded = Boolean(loadedRoutes[route]);

        return (
          <iframe
            key={route}
            ref={(node) => {
              if (node) {
                iframeRefs.current[route] = node;
              }
            }}
            src={frameSrc}
            title={`Eduai Trips Screen ${route}`}
            className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
              isActive && isLoaded ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0"
            }`}
            onLoad={() => {
              bindNavigation(iframeRefs.current[route]);
              setLoadedRoutes((prev) => {
                if (prev[route]) {
                  return prev;
                }

                return {
                  ...prev,
                  [route]: true,
                };
              });
            }}
          />
        );
      })}
    </main>
  );
}
