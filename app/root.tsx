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
import { SavedHousesLink } from "./components/saved-houses-link";

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
				<header className="sticky top-0 z-10 bg-white/10 dark:bg-black/10 py-4 backdrop-blur-sm">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<Link to="/">
							<img
								src="/logo.png"
								alt="HomeVision"
								className="h-10 invert-100 grayscale-100"
							/>
						</Link>
						<SavedHousesLink savedHousesCount={loaderData.savedHousesCount} />
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
