export const RESOURCE_PAGE_BY_ROUTE = {
  "": "/resources/home.html",
  home: "/resources/home.html",
  login: "/resources/login.html",
  flights: "/resources/flights.html",
  hotels: "/resources/flights-alt.html",
  "flights-alt": "/resources/flights-alt.html",
  packages: "/resources/packages.html",
  payment: "/resources/payment.html",
  dashboard: "/resources/dashboard.html",
  about: "/resources/about.html",
  terms: "/resources/terms.html",
};

export function getResourcePageByRoute(routeKey) {
  return RESOURCE_PAGE_BY_ROUTE[routeKey];
}
