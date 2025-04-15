import { useRef, useState, useEffect } from "react";
import type { useFetcher } from "react-router";

interface FetcherData {
	page?: number;
	end?: boolean;
}

interface UseInfiniteScrollOptions<T extends FetcherData> {
	initialPage?: number;
	perPage?: number;
	fetcher: ReturnType<typeof useFetcher<T>>;
	onLoadMore: (page: number, perPage: number) => string;
}

export function useInfiniteScroll<T extends FetcherData>({
	initialPage = 0,
	perPage = 10,
	fetcher,
	onLoadMore,
}: UseInfiniteScrollOptions<T>) {
	const [reachedEnd, setReachedEnd] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const lastProcessedPageRef = useRef<number>(initialPage);

	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data) {
			const data = fetcher.data as T;
			const currentPage = data?.page;
			const isEnd = data?.end;

			if (isEnd) {
				setReachedEnd(true);
			}

			if (
				currentPage !== undefined &&
				currentPage !== lastProcessedPageRef.current
			) {
				lastProcessedPageRef.current = currentPage;
			}
		}
	}, [fetcher.state, fetcher.data]);

	useEffect(() => {
		if (reachedEnd) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && fetcher.state === "idle" && !reachedEnd) {
					const data = fetcher.data as T;
					fetcher.load(onLoadMore(data?.page || 0, perPage));
				}
			},
			{ threshold: 0.0, rootMargin: "0px 0px 500px 0px" },
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
	}, [
		perPage,
		fetcher.state,
		fetcher.load,
		fetcher.data,
		reachedEnd,
		onLoadMore,
	]);

	return {
		loadMoreRef,
		reachedEnd,
		reset: () => {
			setReachedEnd(false);
			lastProcessedPageRef.current = initialPage;
		},
	};
}
