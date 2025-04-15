import { useRef, useState, useEffect } from "react";
import { useFetcher } from "react-router";
import type { House, loader } from "~/routes/houses";

export function useInfiniteScroll({
	perPage = 10,
}: {
	perPage?: number;
}) {
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const fetcher = useFetcher<typeof loader>();
	const reachedEnd = fetcher.data?.end;
	const page = fetcher.data?.page || 0;
	const [houses, setHouses] = useState<House[]>([]);
	const newHouseData = fetcher.data?.houses;
	const lastProcessedPageRef = useRef<number>(0);

	useEffect(() => {
		if (!newHouseData?.length || fetcher.state !== "idle") return;

		if (page > lastProcessedPageRef.current) {
			setHouses((prev) => [...prev, ...newHouseData]);
			lastProcessedPageRef.current = page;
		}
	}, [newHouseData, fetcher.state, page]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (first.isIntersecting && !reachedEnd && fetcher.state === "idle") {
					fetcher.load(`/houses?page=${page + 1}&per_page=${perPage}`);
				}
			},
			{ threshold: 0.1 },
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
	}, [reachedEnd, fetcher.state, fetcher.load, page, perPage]);

	return { loadMoreRef, fetcher, houses, setHouses };
}
