import { useRef, useState, useEffect } from "react";
import type { House } from "~/routes/houses";
import type { EndReason } from "~/routes/houses";

export function useInfiniteScroll() {
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const [houses, setHouses] = useState<House[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [endReason, setEndReason] = useState<EndReason | null>(null);
	const page = useRef(0);

	useEffect(() => {
		async function fetchMoreHouses(replace = false) {
			const res = await fetch(`/houses?page=${page.current + 1}`);
			const data = await res.json();
			if (data.houses.length > 0) {
				if (replace) setHouses(data.houses);
				else setHouses((prev) => [...prev, ...data.houses]);
			}

			if (data.page) page.current = data.page;
			setEndReason(data.end ? data.endReason : null);

			setIsLoading(false);
		}

		const observer = new IntersectionObserver(
			async (entries) => {
				const first = entries[0];
				// don't call if we are loading or finished
				if (first.isIntersecting && !endReason && !isLoading) {
					setIsLoading(true);

					fetchMoreHouses();
				}
			},
			// will start loading next page 500px before reaching end.
			{ threshold: 0.1, rootMargin: "0px 0px 500px 0px" },
		);

		const currentRef = loadMoreRef.current;

		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [endReason, isLoading]);

	function reset() {
		setHouses([]);
		page.current = 0;
		setEndReason(null);
	}

	return { loadMoreRef, reset, houses, isLoading, endReason };
}
