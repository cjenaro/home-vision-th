import { Link, useFetchers } from "react-router";

export function SavedHousesLink({
	savedHousesCount,
}: {
	savedHousesCount: number;
}) {
	const fetchers = useFetchers();
	// this means there's a fetcher submitting to save or remove a house
	const fetcher = fetchers.find(
		(f) => f.key.includes("save-house") && f.state !== "idle",
	);

	return (
		<Link to="/saved" className="relative hover:bg-white/10 rounded-full p-4">
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
			{savedHousesCount > 0 && (
				<span
					className={`absolute top-2 right-2 bg-blue-600 text-white rounded-full size-4 text-xs text-center flex items-center justify-center ${
						fetcher ? "animate-pulse" : ""
					}`}
				>
					{fetcher ? "" : savedHousesCount}
				</span>
			)}
		</Link>
	);
}
