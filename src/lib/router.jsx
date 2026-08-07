/* eslint-disable react-refresh/only-export-components */
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const RouterContext = createContext(null);
const ParamsContext = createContext({});
const OutletContext = createContext(null);

const readLocation = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  state: window.history.state,
});

const normalizeSegments = (value) =>
  value
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

const decodeSegment = (segment) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const matchRoute = ({ index, path }, pathname) => {
  const pathnameSegments = normalizeSegments(pathname);

  if (index) {
    return pathnameSegments.length === 0 ? {} : null;
  }

  if (path === "*") {
    return {};
  }

  if (typeof path !== "string") {
    return null;
  }

  const patternSegments = normalizeSegments(path);
  if (patternSegments.length !== pathnameSegments.length) {
    return null;
  }

  const params = {};
  for (let index = 0; index < patternSegments.length; index += 1) {
    const patternSegment = patternSegments[index];
    const pathnameSegment = pathnameSegments[index];

    if (patternSegment.startsWith(":")) {
      params[patternSegment.slice(1)] = decodeSegment(pathnameSegment);
      continue;
    }

    if (patternSegment.toLowerCase() !== pathnameSegment.toLowerCase()) {
      return null;
    }
  }

  return params;
};

const selectRoute = (routes, pathname) => {
  let fallback = null;

  for (const route of routes) {
    if (!isValidElement(route)) continue;

    if (route.props.path === "*") {
      fallback = route;
      continue;
    }

    const params = matchRoute(route.props, pathname);
    if (params !== null) {
      return { route, params };
    }
  }

  return fallback ? { route: fallback, params: {} } : null;
};

export const BrowserRouter = ({ children }) => {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const handleLocationChange = () => setLocation(readLocation());

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navigate = useCallback((destination, options = {}) => {
    if (typeof destination === "number") {
      window.history.go(destination);
      return;
    }

    const url = new URL(destination, window.location.href);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method](options.state ?? null, "", nextUrl);
    setLocation(readLocation());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
};

BrowserRouter.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Routes = ({ children }) => {
  const { pathname } = useLocation();
  const routes = Children.toArray(children);
  const layoutRoute = routes.find(
    (route) =>
      isValidElement(route) &&
      route.props.path == null &&
      route.props.index !== true
  );
  const candidateRoutes = layoutRoute
    ? Children.toArray(layoutRoute.props.children)
    : routes;
  const match = selectRoute(candidateRoutes, pathname);

  if (!match) return null;

  const content = match.route.props.element ?? null;
  const renderedRoute = layoutRoute ? (
    <OutletContext.Provider value={content}>
      {layoutRoute.props.element}
    </OutletContext.Provider>
  ) : (
    content
  );

  return (
    <ParamsContext.Provider value={match.params}>
      {renderedRoute}
    </ParamsContext.Provider>
  );
};

Routes.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Route = () => null;

export const Outlet = () => useContext(OutletContext);

export const Link = ({ children, download, onClick, target, to, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank" ||
      download != null
    ) {
      return;
    }

    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      download={download}
      onClick={handleClick}
      target={target}
      {...props}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.node,
  download: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onClick: PropTypes.func,
  target: PropTypes.string,
  to: PropTypes.string.isRequired,
};

export const useLocation = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useLocation must be used within BrowserRouter");
  }

  return context.location;
};

export const useNavigate = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useNavigate must be used within BrowserRouter");
  }

  return context.navigate;
};

export const useParams = () => useContext(ParamsContext);
