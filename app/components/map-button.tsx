import MaplibreMap, { Marker } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef, useState } from "react";
import { useEffect } from "react";
import type { House } from "~/routes/houses";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function MapPopup({
	onClose,
	address,
}: {
	onClose: () => void;
	address: string;
}) {
	const [[lat, lon], setLatLon] = useState<[number, number]>([40, -100]);
	const mRef = useRef<MapRef>(null);
	const scope = useRef(null);

	useEffect(() => {
		const zipcode = address.split(" ").pop();
		async function fetchPlace() {
			const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`, {
				cache: "force-cache",
			});
			const data = await response.json();
			const [place] = data.places;
			setLatLon([place.latitude, place.longitude]);
			if (mRef.current) {
				mRef.current.setCenter([place.longitude, place.latitude]);
			}
		}
		fetchPlace();
	}, [address]);

	const { contextSafe } = useGSAP({ scope });
	const onLoad = contextSafe(() => {
		gsap.to(".loader", { opacity: 0 });
	});

	const close = contextSafe(() => {
		gsap.to(".loader", { opacity: 1 });
		onClose();
	});

	return (
		<div ref={scope} className="w-full absolute">
			<div className="w-full pointer-events-none h-full absolute z-100 loader bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] flex justify-center items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="size-10 animate-spin"
					aria-label="Loading map"
				>
					<title>Loading map</title>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
						fill="none"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			</div>

			<MaplibreMap
				ref={mRef}
				initialViewState={{
					longitude: -100,
					latitude: 40,
					zoom: 14,
				}}
				style={{ width: "100%", height: 300 }}
				mapStyle="https://tiles.openfreemap.org/styles/liberty"
				onLoad={onLoad}
			>
				<Marker latitude={lat} longitude={lon} />
				<button
					type="button"
					onClick={close}
					className="absolute top-4 right-4 rounded-full shadow bg-[hsl(var(--background))] text-[hsl(var(--foreground))] cursor-pointer p-2 flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<title>Close map</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</MaplibreMap>
		</div>
	);
}

export default function MapButton({ house }: { house: House }) {
	const [showMap, setShowMap] = useState(false);
	const scope = useRef(null);

	const { contextSafe } = useGSAP({ scope });

	const onOpenMap = contextSafe(() => {
		const tl = gsap.timeline({ onComplete: () => setShowMap(true) });
		tl.to(".cta .open-map", { opacity: 0 });
		tl.to(".cta", {
			width: "100%",
			height: 300,
			ease: "elastic.out(0.3,0.4)",
			duration: 0.2,
		});
	});

	const onCloseMap = contextSafe(() => {
		const tl = gsap.timeline({ onComplete: () => setShowMap(false) });
		tl.to(".cta .open-map", { opacity: 1 });
		tl.to(".cta", {
			width: "auto",
			height: "auto",
			ease: "elastic.out(0.3,0.4)",
			duration: 0.2,
		});
	});

	return (
		<div className="min-h-12 relative mt-4" ref={scope}>
			<div className="absolute w-fit rounded-lg z-10 overflow-hidden cta bottom-0 left-0 flex items-end border bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] border-[hsl(var(--foreground))] dark:border-[hsl(var(--dark-foreground))]">
				{showMap && <MapPopup address={house.address} onClose={onCloseMap} />}
				<button
					type="button"
					onClick={onOpenMap}
					className="open-map px-4 py-2 cursor-pointer flex gap-3"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<title>Show map</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
						/>
					</svg>
					Show in map
				</button>
			</div>
		</div>
	);
}
