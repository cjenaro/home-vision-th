import {
  data,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { getSession } from "./session.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", type: "image/png", href: "favicon-32x32.png", sizes: "32x32" },
  { rel: "icon", type: "image/png", href: "favicon-16x16.png", sizes: "16x16" },
];

export function meta() {
  return [
    { title: "Home Vision" },
    { name: "description", content: "Home Vision's take home challenge" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const savedHouses = session.get("savedHouses") || [];
  return data({ savedHousesCount: savedHouses.length });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="dark:bg-gray-900 dark:text-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white/10 dark:bg-black/10 py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/">
              <img
                src="/logo.png"
                alt="HomeVision"
                className="h-10 invert-100 grayscale-100"
              />
            </Link>
            <Link
              to="/saved"
              className="relative hover:bg-white/10 rounded-full p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <title>Saved</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
              {loaderData && loaderData.savedHousesCount > 0 && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full size-4 text-xs text-center flex items-center justify-center">
                  {loaderData.savedHousesCount}
                </span>
              )}
            </Link>
          </div>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  let isRouteError = false;

  if (isRouteErrorResponse(error)) {
    isRouteError = true;
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        {message}
      </h1>
      <p className="text-xl mb-8 max-w-md">{details}</p>
      {isRouteError && (
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-8"
        >
          Back to Homepage
        </a>
      )}
      {stack && (
        <pre className="w-full max-w-2xl p-4 overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded text-left">
          <code className="text-sm">{stack}</code>
        </pre>
      )}
    </main>
  );
}
