export const ROUTE_ORDER = [
  "/",
  "/flights",
  "/hotels",
  "/packages",
  "/dashboard",
  "/about",
  "/terms",
  "/login",
  "/payment",
];

export const ROUTE_LABELS = {
  "/": "Home",
  "/flights": "Flights",
  "/hotels": "Hotels",
  "/packages": "Packages",
  "/dashboard": "Dashboard",
  "/about": "About Us",
  "/terms": "Terms",
  "/login": "Login / Signup",
  "/payment": "Payment",
};

export const NAV_ITEMS = [
  { route: "/", label: "Home" },
  { route: "/flights", label: "Flights" },
  { route: "/hotels", label: "Hotels" },
  { route: "/packages", label: "Packages" },
  { route: "/dashboard", label: "Dashboard" },
  { route: "/about", label: "About Us" },
  { route: "/terms", label: "T&C" },
  { route: "/login", label: "Login" },
];

const SLUG_TO_ROUTE = {
  "": "/",
  home: "/",
  flights: "/flights",
  hotels: "/hotels",
  "flights-alt": "/hotels",
  packages: "/packages",
  dashboard: "/dashboard",
  about: "/about",
  terms: "/terms",
  login: "/login",
  payment: "/payment",
};

export function normalizeRoute(route) {
  if (!route || route === "/") {
    return "/";
  }

  const cleanRoute = route.split("?")[0].split("#")[0];
  return `/${cleanRoute.replace(/^\/+/, "")}`;
}

export function getRouteFromSlug(slug) {
  return SLUG_TO_ROUTE[slug] || null;
}

export function getRouteFromPath(pathname) {
  const normalizedRoute = normalizeRoute(pathname);
  return ROUTE_ORDER.includes(normalizedRoute) ? normalizedRoute : "/";
}

export function getRouteIndex(route) {
  const normalizedRoute = normalizeRoute(route);
  const index = ROUTE_ORDER.indexOf(normalizedRoute);
  return index === -1 ? 0 : index;
}

export function getRouteDirection(fromRoute, toRoute) {
  return getRouteIndex(toRoute) >= getRouteIndex(fromRoute) ? "forward" : "back";
}

export function isKnownRoute(route) {
  return ROUTE_ORDER.includes(normalizeRoute(route));
}
